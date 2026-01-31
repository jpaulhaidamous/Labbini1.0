import { Controller, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getCurrentUser(@CurrentUser('userId') userId: string) {
    return this.usersService.findById(userId);
  }

  @Get('me/stats')
  async getMyStats(@CurrentUser('userId') userId: string) {
    return this.usersService.getUserStats(userId);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put('me')
  async updateCurrentUser(
    @CurrentUser('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(userId, updateUserDto);
  }

  @Delete('me')
  async deleteCurrentUser(@CurrentUser('userId') userId: string) {
    return this.usersService.deleteUser(userId);
  }
}
