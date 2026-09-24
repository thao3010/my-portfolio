import {
  RESERVED_USERNAMES,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from '@portfolio/shared';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isPortfolioUsername', async: false })
export class IsPortfolioUsernameConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    if (typeof value !== 'string') return false;
    const username = value.toLowerCase();
    if (
      username.length < USERNAME_MIN_LENGTH ||
      username.length > USERNAME_MAX_LENGTH
    ) {
      return false;
    }
    if (!USERNAME_REGEX.test(username)) return false;
    if (RESERVED_USERNAMES.has(username)) return false;
    return true;
  }

  defaultMessage(): string {
    return 'username must be 3–30 chars, lowercase letters, numbers, hyphens; not reserved';
  }
}

export function IsPortfolioUsername(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPortfolioUsernameConstraint,
    });
  };
}
