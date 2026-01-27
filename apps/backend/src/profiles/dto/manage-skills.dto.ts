import { IsArray, IsString } from 'class-validator';

export class AddSkillsDto {
  @IsArray()
  @IsString({ each: true })
  skillIds: string[];
}

export class RemoveSkillDto {
  @IsString()
  skillId: string;
}
