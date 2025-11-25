import { z } from 'zod';
import { Invoice } from '../types/domain.js';
import { buildUpdateSchema, isISODateString, parseWithSchema } from '../utils/schema.js';

const coreSchema = z.object({
  finalQuoteId: z.string().min(1, 'finalQuoteId is required.'),
  amountDue: z.number().nonnegative('amountDue must be zero or greater.'),
  createdOn: z
    .string()
    .refine((value) => isISODateString(value), 'createdOn must be a valid ISO date string.'),
  dueDate: z
    .string()
    .refine((value) => isISODateString(value), 'dueDate must be a valid ISO date string.'),
  paid: z.boolean(),
  paymentRef: z.string().min(1).nullable().optional()
});

const createSchema = coreSchema.extend({
  id: z.string().min(1).optional()
});

const updateSchema = buildUpdateSchema(coreSchema);

export type InvoiceInput = z.infer<typeof createSchema>;
export type InvoiceUpdateInput = z.infer<typeof updateSchema>;

export function parseInvoice(payload: unknown): InvoiceInput {
  return parseWithSchema(createSchema, payload, { label: 'Invoice' });
}

export function parseInvoiceUpdate(payload: unknown): InvoiceUpdateInput {
  return parseWithSchema(updateSchema, payload, { label: 'Invoice update' });
}

export function applyInvoiceUpdate(existing: Invoice, changes: InvoiceUpdateInput): Invoice {
  return {
    ...existing,
    ...changes
  };
}