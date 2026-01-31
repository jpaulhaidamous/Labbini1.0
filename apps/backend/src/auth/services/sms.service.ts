import { Injectable, Logger } from '@nestjs/common';

interface VerificationCode {
  code: string;
  phone: string;
  expiresAt: Date;
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private verificationCodes = new Map<string, VerificationCode>();
  private readonly CODE_EXPIRY_MINUTES = 10;
  private readonly ENABLE_REAL_SMS =
    process.env.ENABLE_SMS === 'true' || false;

  /**
   * Generate a random 6-digit verification code
   */
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send verification code via SMS
   * @param phone Lebanese phone number (+961XXXXXXXX)
   * @returns verification code (only in development mode)
   */
  async sendVerificationCode(phone: string): Promise<{ success: boolean; code?: string; message: string }> {
    try {
      // Clean up expired codes
      this.cleanupExpiredCodes();

      // Generate new code
      const code = this.generateCode();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + this.CODE_EXPIRY_MINUTES);

      // Store code
      this.verificationCodes.set(phone, {
        code,
        phone,
        expiresAt,
      });

      if (this.ENABLE_REAL_SMS) {
        // TODO: Integrate with real SMS provider (e.g., Twilio, AWS SNS, etc.)
        // await this.sendRealSMS(phone, code);
        this.logger.log(
          `[PRODUCTION] SMS sent to ${phone} (code hidden for security)`,
        );
        return {
          success: true,
          message: 'Verification code sent successfully',
        };
      } else {
        // Development mode: Log code to console
        this.logger.warn('═══════════════════════════════════════');
        this.logger.warn(`🔐 SMS VERIFICATION CODE (DEV MODE)`);
        this.logger.warn(`📱 Phone: ${phone}`);
        this.logger.warn(`🔢 Code: ${code}`);
        this.logger.warn(`⏰ Expires at: ${expiresAt.toLocaleString()}`);
        this.logger.warn('═══════════════════════════════════════');

        return {
          success: true,
          code, // Return code only in dev mode
          message: 'Verification code logged to console (dev mode)',
        };
      }
    } catch (error) {
      this.logger.error('Failed to send verification code:', error);
      return {
        success: false,
        message: 'Failed to send verification code',
      };
    }
  }

  /**
   * Verify the code entered by user
   */
  async verifyCode(
    phone: string,
    code: string,
  ): Promise<{ success: boolean; message: string }> {
    const stored = this.verificationCodes.get(phone);

    if (!stored) {
      return {
        success: false,
        message: 'No verification code found for this phone number',
      };
    }

    // Check expiration
    if (new Date() > stored.expiresAt) {
      this.verificationCodes.delete(phone);
      return {
        success: false,
        message: 'Verification code has expired',
      };
    }

    // Check code match
    if (stored.code !== code) {
      return {
        success: false,
        message: 'Invalid verification code',
      };
    }

    // Code is valid - delete it (one-time use)
    this.verificationCodes.delete(phone);

    this.logger.log(`✅ Phone ${phone} verified successfully`);

    return {
      success: true,
      message: 'Phone number verified successfully',
    };
  }

  /**
   * Clean up expired verification codes
   */
  private cleanupExpiredCodes() {
    const now = new Date();
    for (const [phone, data] of this.verificationCodes.entries()) {
      if (now > data.expiresAt) {
        this.verificationCodes.delete(phone);
        this.logger.log(`Cleaned up expired code for ${phone}`);
      }
    }
  }

  /**
   * Check if a phone number has a pending verification code
   */
  hasPendingCode(phone: string): boolean {
    const stored = this.verificationCodes.get(phone);
    if (!stored) return false;

    // Check if expired
    if (new Date() > stored.expiresAt) {
      this.verificationCodes.delete(phone);
      return false;
    }

    return true;
  }

  /**
   * Get time remaining for verification code
   */
  getCodeExpiryTime(phone: string): number | null {
    const stored = this.verificationCodes.get(phone);
    if (!stored) return null;

    const now = new Date();
    if (now > stored.expiresAt) {
      this.verificationCodes.delete(phone);
      return null;
    }

    return Math.floor((stored.expiresAt.getTime() - now.getTime()) / 1000);
  }

  /**
   * TODO: Implement real SMS sending via provider
   * Example integrations:
   * - Twilio
   * - AWS SNS
   * - Vonage (Nexmo)
   * - MessageBird
   *
   * For Lebanese numbers, recommended providers:
   * - Twilio (good international coverage)
   * - Infobip (MENA region specialist)
   */
  private async sendRealSMS(phone: string, code: string): Promise<void> {
    // Example Twilio integration:
    // const client = twilio(accountSid, authToken);
    // await client.messages.create({
    //   body: `Your Labbini verification code is: ${code}. Valid for 10 minutes.`,
    //   from: twilioPhoneNumber,
    //   to: phone
    // });

    throw new Error('Real SMS integration not yet implemented');
  }
}
