import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AddSkillsDto } from './dto/manage-skills.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@CurrentUser('userId') userId: string) {
    return this.profilesService.getProfile(userId);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  async updateMyProfile(
    @CurrentUser('userId') userId: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.updateProfile(userId, updateProfileDto);
  }

  @Post('me/skills')
  @UseGuards(JwtAuthGuard)
  async addSkills(
    @CurrentUser('userId') userId: string,
    @Body() addSkillsDto: AddSkillsDto,
  ) {
    return this.profilesService.addSkills(userId, addSkillsDto);
  }

  @Delete('me/skills/:skillId')
  @UseGuards(JwtAuthGuard)
  async removeSkill(
    @CurrentUser('userId') userId: string,
    @Param('skillId') skillId: string,
  ) {
    return this.profilesService.removeSkill(userId, skillId);
  }

  @Get('search')
  @Public()
  async searchProfiles(
    @Query('category') category?: string,
    @Query('governorate') governorate?: string,
    @Query('minRate') minRate?: string,
    @Query('maxRate') maxRate?: string,
    @Query('skills') skills?: string,
    @Query('availability') availability?: string,
    @Query('minJobSuccess') minJobSuccess?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const skillsArray = skills ? skills.split(',') : undefined;
    const availabilityBool = availability === 'true' ? true : availability === 'false' ? false : undefined;

    return this.profilesService.searchProfiles({
      category,
      governorate,
      minRate: minRate ? parseInt(minRate, 10) : undefined,
      maxRate: maxRate ? parseInt(maxRate, 10) : undefined,
      skills: skillsArray,
      availability: availabilityBool,
      minJobSuccess: minJobSuccess ? parseInt(minJobSuccess, 10) : undefined,
      search,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  @Get(':userId')
  @Public()
  async getPublicProfile(@Param('userId') userId: string) {
    return this.profilesService.getPublicProfile(userId);
  }

  @Get(':userId/reviews')
  @Public()
  async getProfileReviews(
    @Param('userId') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.profilesService.getProfileReviews(
      userId,
      page ? parseInt(page, 10) : undefined,
      limit ? parseInt(limit, 10) : undefined,
    );
  }
}
