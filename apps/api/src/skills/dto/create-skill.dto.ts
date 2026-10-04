import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateSkillDto {
  @ApiProperty({ example: 'https://cdn.simpleicons.org/react/61DAFB' })
  @IsString()
  @MinLength(1)
  @MaxLength(2048)
  icon!: string;

  @ApiProperty({ example: 'React' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title!: string;

  @ApiProperty({ example: 'Building UI with hooks and server components.' })
  @IsString()
  @MaxLength(2000)
  description!: string;
}
