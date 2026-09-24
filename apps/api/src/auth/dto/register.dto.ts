import { DEFAULT_LOCALE } from '@portfolio/shared';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { IsPortfolioUsername } from '../../common/validators/is-username';
import { IsSupportedLocale } from '../../common/validators/is-supported-locale';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  password!: string;

  @IsPortfolioUsername()
  username!: string;

  @IsOptional()
  @IsSupportedLocale()
  preferredLocale?: typeof DEFAULT_LOCALE;
}
