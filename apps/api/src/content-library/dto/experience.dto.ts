import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  @MaxLength(200)
  company!: string;

  @IsString()
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  period?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  description?: string;
}

export class UpdateExperienceDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  company?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  period?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  description?: string;
}
