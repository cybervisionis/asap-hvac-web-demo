import { z } from 'zod';
import { Payment } from '../types/domain.js';
import { buildUpdateSchema, isISODateString, parseWithSchema } from '../utils/schema.js';

const coreSchema = z.object({
  invoiceId: z.string().min(1, 'invoiceId is required.'),
  amount: z.number().positive('amount must be greater than zero.'),
  paidOn: z
    .string()
    .refine((value) => isISODateString(value), 'paidOn must be a valid ISO date string.'),
  method: z.string().min(1, 'method is required.'),
  reference: z.string().min(1).nullable().optional(),
  notes: z.string().min(1).nullable().optional()
});

const createSchema = coreSchema.extend({
  id: z.string().min(1).optional()
});

const updateSchema = buildUpdateSchema(coreSchema);

export type PaymentInput = z.infer<typeof createSchema>;
export type PaymentUpdateInput = z.infer<typeof updateSchema>;

export function parsePayment(payload: unknown): PaymentInput {
  return parseWithSchema(createSchema, payload, { label: 'Payment' });
}

export function parsePaymentUpdate(payload: unknown): PaymentUpdateInput {
  return parseWithSchema(updateSchema, payload, { label: 'Payment update' });
}

export function applyPaymentUpdate(existing: Payment, changes: PaymentUpdateInput): Payment {
  return {
    ...existing,
    ...changes
  };
}