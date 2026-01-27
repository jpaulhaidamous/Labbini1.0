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
  ParseIntPipe,
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
    @Query('minRate', new ParseIntPipe({ optional: true })) minRate?: number,
    @Query('maxRate', new ParseIntPipe({ optional: true })) maxRate?: number,
    @Query('skills') skills?: string,
    @Query('availability') availability?: string,
    @Query('minJobSuccess', new ParseIntPipe({ optional: true })) minJobSuccess?: number,
    @Query('search') search?: string,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    const skillsArray = skills ? skills.split(',') : undefined;
    const availabilityBool = availability === 'true' ? true : availability === 'false' ? false : undefined;

    return this.profilesService.searchProfiles({
      category,
      governorate,
      minRate,
      maxRate,
      skills: skillsArray,
      availability: availabilityBool,
      minJobSuccess,
      search,
      page,
      limit,
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
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return this.profilesService.getProfileReviews(userId, page, limit);
  }
}
