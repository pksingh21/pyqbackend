import Joi, { ObjectSchema, ValidationError } from 'joi';
import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../utils/catchAsync';

interface ValidateRequestOptions {
  query?: ObjectSchema;
  params?: ObjectSchema;
  body?: ObjectSchema;
}

const fieldsToValidate: (keyof ValidateRequestOptions)[] = ['query', 'params', 'body'];

const validateRequest = (options: ValidateRequestOptions, routeName: string) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const errors: ValidationError[] = [];

    // Iterate over the fields (query, params, body) and validate if the schema exists
    fieldsToValidate.forEach((field) => {
      if (options[field]) {
        const { error, value } = options[field].validate(req[field], { abortEarly: false });
        if (error) {
          errors.push(error);
        } else {
          req[field] = value;
        }
      }
    });

    // If there are validation errors, return a 400 response
    if (errors.length > 0) {
      console.dir({ request: routeName, errors }, { depth: null, colors: true });
      return res.status(400).json({
        status: 'error',
        errors,
      });
    }

    next();
  });

export default validateRequest;
