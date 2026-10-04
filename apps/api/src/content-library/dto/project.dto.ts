import { IsArray, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MaxLength(200)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  description?: string;

  @IsOptional()
  @IsUrl({ require_protocol: false })
  @MaxLength(500)
  url?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tech?: string[];
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  description?: string;

  @IsOptional()
  @IsUrl({ require_protocol: false })
  @MaxLength(500)
  url?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tech?: string[];
}
