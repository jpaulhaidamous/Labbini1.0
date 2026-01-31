import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { SmsService } from './services/sms.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private smsService: SmsService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: registerDto.email }, { phone: registerDto.phone }],
      },
    });

    if (existingUser) {
      throw new ConflictException('Email or phone number already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(registerDto.password, 10);

    // Create user with profile and wallet
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        phone: registerDto.phone,
        passwordHash,
        role: registerDto.role,
        verificationLevel: 'LEVEL_0',
        emailVerified: false,
        phoneVerified: false,
        profile: {
          create: {
            displayNameEn: registerDto.displayNameEn || registerDto.email.split('@')[0],
            displayNameAr: registerDto.displayNameAr,
          },
        },
        wallet: {
          create: {
            availableBalance: 0,
            pendingBalance: 0,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // TODO: Send verification email
    // TODO: Send phone verification SMS

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        verificationLevel: user.verificationLevel,
        profile: user.profile,
      },
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
      include: { profile: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is active
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is suspended or banned');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        verificationLevel: user.verificationLevel,
        emailVerified: user.emailVerified,
        phoneVerified: user.phoneVerified,
        profile: user.profile,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      // Check if refresh token exists in database
      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!storedToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Check if token is expired
      if (storedToken.expiresAt < new Date()) {
        await this.prisma.refreshToken.delete({
          where: { id: storedToken.id },
        });
        throw new UnauthorizedException('Refresh token expired');
      }

      // Generate new tokens
      const tokens = await this.generateTokens(
        storedToken.user.id,
        storedToken.user.email,
        storedToken.user.role,
      );

      // Delete old refresh token
      await this.prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });

      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string) {
    // Delete all refresh tokens for this user
    await this.prisma.refreshToken.deleteMany({
      where: { userId },
    });

    return { message: 'Logged out successfully' };
  }

  async verifyEmail(userId: string, token: string) {
    // TODO: Implement email verification logic
    // For MVP, we'll just mark as verified
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        emailVerified: true,
        verificationLevel: 'LEVEL_0',
      },
    });

    return { message: 'Email verified successfully', user };
  }

  async sendPhoneVerificationCode(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true, phoneVerified: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.phoneVerified) {
      throw new ConflictException('Phone number is already verified');
    }

    if (!user.phone) {
      throw new ConflictException('No phone number associated with this account');
    }

    // Send verification code via SMS
    const result = await this.smsService.sendVerificationCode(user.phone);

    return {
      success: result.success,
      message: result.message,
      code: result.code, // Only included in dev mode
    };
  }

  async verifyPhone(userId: string, code: string) {
    if (code.length !== 6) {
      throw new UnauthorizedException('Invalid verification code format');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true, phoneVerified: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.phoneVerified) {
      throw new ConflictException('Phone number is already verified');
    }

    if (!user.phone) {
      throw new ConflictException('No phone number associated with this account');
    }

    // Verify code with SMS service
    const verifyResult = await this.smsService.verifyCode(user.phone, code);

    if (!verifyResult.success) {
      throw new UnauthorizedException(verifyResult.message);
    }

    // Update user verification status
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        phoneVerified: true,
        verificationLevel: 'LEVEL_1',
      },
      include: { profile: true },
    });

    return {
      message: 'Phone verified successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        phone: updatedUser.phone,
        verificationLevel: updatedUser.verificationLevel,
        phoneVerified: updatedUser.phoneVerified,
      },
    };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    // Generate access token
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '15m',
    });

    // Generate refresh token
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d',
    });

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: {
          include: {
            skills: {
              include: {
                skill: true,
              },
            },
          },
        },
        wallet: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove sensitive data
    const { passwordHash, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}
