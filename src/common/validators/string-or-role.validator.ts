import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsStringOrRole(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsStringOrRole',
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          return typeof value === 'object' || typeof value === 'string' || typeof value === undefined;
        },
      },
    });
  };
}