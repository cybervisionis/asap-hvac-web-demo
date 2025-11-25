import { z } from 'zod';
import { PartsOrder } from '../types/domain.js';
import { buildUpdateSchema, isISODateString, parseWithSchema } from '../utils/schema.js';

const statusEnum = z.enum(['ordered', 'backordered', 'fulfilled', 'canceled']);

const itemSchema = z.object({
  partId: z.string().min(1, 'partId is required.'),
  description: z.string().min(1, 'description is required.'),
  qty: z.number().int().positive('qty must be greater than zero.'),
  costEach: z.number().nonnegative('costEach must be zero or greater.')
});

const coreSchema = z.object({
  finalQuoteId: z.string().min(1, 'finalQuoteId is required.'),
  items: z.array(itemSchema).min(1, 'At least one item is required.'),
  totalCost: z.number().nonnegative('totalCost must be zero or greater.'),
  status: statusEnum,
  etaDate: z
    .string()
    .refine((value) => isISODateString(value), 'etaDate must be a valid ISO date string.')
    .nullable()
    .optional(),
  notes: z.string().min(1).nullable().optional()
});

const createSchema = coreSchema.extend({
  id: z.string().min(1).optional()
});

const updateSchema = buildUpdateSchema(coreSchema);

export type PartsOrderInput = z.infer<typeof createSchema>;
export type PartsOrderUpdateInput = z.infer<typeof updateSchema>;

export function parsePartsOrder(payload: unknown): PartsOrderInput {
  return parseWithSchema(createSchema, payload, { label: 'PartsOrder' });
}

export function parsePartsOrderUpdate(payload: unknown): PartsOrderUpdateInput {
  return parseWithSchema(updateSchema, payload, { label: 'PartsOrder update' });
}

export function applyPartsOrderUpdate(existing: PartsOrder, changes: PartsOrderUpdateInput): PartsOrder {
  return {
    ...existing,
    ...changes,
    items: changes.items ?? existing.items
  };
}