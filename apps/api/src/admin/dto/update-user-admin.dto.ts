import { UserRole } from '@portfolio/shared';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class UpdateUserAdminDto {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
