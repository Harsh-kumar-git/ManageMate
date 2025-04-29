import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';

export const validate = (schema: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    schema.parseAsync(req.body)
      .then(() => next())
      .catch((error) => {
        console.error('Validation error:', error);
        if (error instanceof ZodError) {
          const errors = error.errors.reduce((acc: Record<string, string>, curr) => {
            const path = curr.path.join('.');
            acc[path] = curr.message;
            return acc;
          }, {});
          res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors,
          });
        } else {
          res.status(400).json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Validation failed',
          });
        }
      });
  };
};
