import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateContactDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  label?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  github?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  linkedin?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  website?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;
}

export class UpdateContactDto extends CreateContactDto {}
