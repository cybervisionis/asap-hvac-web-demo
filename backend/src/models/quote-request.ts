import { z } from 'zod';
import { QuoteRequest } from '../types/domain.js';
import { buildUpdateSchema, isISODateString, parseWithSchema } from '../utils/schema.js';

const urgencyEnum = z.enum(['low', 'normal', 'high']);
const statusEnum = z.enum([
  'new',
  'awaiting-scheduling',
  'scheduled',
  'inspection-complete',
  'awaiting-approval',
  'approved',
  'declined'
]);

const coreSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required.'),
  contactPhone: z.string().min(7, 'Contact phone is required.'),
  email: z.string().email(),
  address: z.string().min(1, 'Address is required.'),
  serviceType: z.string().min(1, 'Service type is required.'),
  urgency: urgencyEnum,
  requestedDate: z
    .string()
    .refine((value) => isISODateString(value), 'Requested date must be a valid ISO date string.'),
  unitAgeYears: z.number().min(0).nullable().optional(),
  symptoms: z.array(z.string().min(1)),
  notes: z.string().min(1).nullable().optional(),
  status: statusEnum
});

const createSchema = coreSchema.extend({
  id: z.string().min(1).optional()
});

const updateSchema = buildUpdateSchema(coreSchema);

export type QuoteRequestInput = z.infer<typeof createSchema>;
export type QuoteRequestUpdateInput = z.infer<typeof updateSchema>;

export function parseQuoteRequest(payload: unknown): QuoteRequestInput {
  const defaults = {
    urgency: 'normal' as QuoteRequest['urgency'],
    status: 'new' as QuoteRequest['status'],
    symptoms: [] as string[]
  };

  const enrichedPayload = mergeDefaults(payload, defaults);
  return parseWithSchema(createSchema, enrichedPayload, { label: 'QuoteRequest' });
}

export function parseQuoteRequestUpdate(payload: unknown): QuoteRequestUpdateInput {
  return parseWithSchema(updateSchema, payload, { label: 'QuoteRequest update' });
}

export function applyQuoteRequestUpdate(existing: QuoteRequest, changes: QuoteRequestUpdateInput): QuoteRequest {
  return {
    ...existing,
    ...changes,
    symptoms: changes.symptoms ?? existing.symptoms
  };
}

function mergeDefaults(payload: unknown, defaults: Partial<QuoteRequest>): Record<string, unknown> {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return { ...defaults };
  }

  return { ...defaults, ...payload };
}