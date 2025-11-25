import { z } from 'zod';
import { FinalQuote } from '../types/domain.js';
import { buildUpdateSchema, isISODateString, parseWithSchema } from '../utils/schema.js';

const statusEnum = z.enum(['draft', 'awaiting-approval', 'approved', 'expired', 'declined']);

const coreSchema = z.object({
  quoteRequestId: z.string().min(1, 'quoteRequestId is required.'),
  baseEstimate: z.number().nonnegative('baseEstimate must be zero or greater.'),
  adjustmentsTotal: z.number().nonnegative('adjustmentsTotal must be zero or greater.'),
  finalTotal: z.number().nonnegative('finalTotal must be zero or greater.'),
  expiresOn: z
    .string()
    .refine((value) => isISODateString(value), 'expiresOn must be a valid ISO date string.'),
  status: statusEnum
});

const createSchema = coreSchema.extend({
  id: z.string().min(1).optional()
});

const updateSchema = buildUpdateSchema(coreSchema);

export type FinalQuoteInput = z.infer<typeof createSchema>;
export type FinalQuoteUpdateInput = z.infer<typeof updateSchema>;

export function parseFinalQuote(payload: unknown): FinalQuoteInput {
  return parseWithSchema(createSchema, payload, { label: 'FinalQuote' });
}

export function parseFinalQuoteUpdate(payload: unknown): FinalQuoteUpdateInput {
  return parseWithSchema(updateSchema, payload, { label: 'FinalQuote update' });
}

export function applyFinalQuoteUpdate(existing: FinalQuote, changes: FinalQuoteUpdateInput): FinalQuote {
  return {
    ...existing,
    ...changes
  };
}