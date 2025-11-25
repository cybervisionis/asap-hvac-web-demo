import { ZodError, ZodSchema, z } from 'zod';
import { ValidationError } from './errors.js';

export interface SchemaOptions {
  label?: string;
}

export function parseWithSchema<T>(schema: ZodSchema<T>, payload: unknown, options: SchemaOptions = {}): T {
  try {
    return schema.parse(payload);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      throw new ValidationError(options.label ?? 'Payload failed validation.', error.flatten());
    }

    throw error;
  }
}

export const isISODateString = (value: string): boolean => !Number.isNaN(Date.parse(value));

export function buildUpdateSchema<T extends z.ZodRawShape>(schema: z.ZodObject<T>, message = 'At least one field must be provided.') {
  return schema.partial().refine((data) => Object.keys(data).length > 0, {
    message
  });
}
