import { isSupportedLocale } from '@portfolio/shared';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isSupportedLocale', async: false })
export class IsSupportedLocaleConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === 'string' && isSupportedLocale(value);
  }

  defaultMessage(): string {
    return 'locale must be one of supported locales (en, vi)';
  }
}

export function IsSupportedLocale(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSupportedLocaleConstraint,
    });
  };
}
