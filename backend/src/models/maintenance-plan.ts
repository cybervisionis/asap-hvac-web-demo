import { z } from 'zod';
import { MaintenancePlan } from '../types/domain.js';
import { buildUpdateSchema, parseWithSchema } from '../utils/schema.js';

const coreSchema = z.object({
  planTier: z.string().min(1, 'Plan tier is required.'),
  annualFee: z.number().nonnegative('Annual fee must be zero or greater.'),
  includedServices: z.array(z.string().min(1)).min(1, 'At least one included service is required.'),
  partsDiscountPct: z.number().int().min(0).max(100),
  extras: z.array(z.string().min(1)).optional()
});

const createSchema = coreSchema.extend({
  id: z.string().min(1).optional()
});

const updateSchema = buildUpdateSchema(coreSchema);

export type MaintenancePlanInput = z.infer<typeof createSchema>;
export type MaintenancePlanUpdateInput = z.infer<typeof updateSchema>;

export function parseMaintenancePlan(payload: unknown): MaintenancePlanInput {
  return normalizeExtras(parseWithSchema(createSchema, payload, { label: 'MaintenancePlan' }));
}

export function parseMaintenancePlanUpdate(payload: unknown): MaintenancePlanUpdateInput {
  return parseWithSchema(updateSchema, payload, { label: 'MaintenancePlan update' });
}

export function applyMaintenancePlanUpdate(existing: MaintenancePlan, changes: MaintenancePlanUpdateInput): MaintenancePlan {
  return {
    ...existing,
    ...changes,
    extras: changes.extras ?? existing.extras,
    includedServices: changes.includedServices ?? existing.includedServices
  };
}

function normalizeExtras<T extends { extras?: string[] }>(input: T): T {
  if (input.extras === undefined) {
    return { ...input, extras: [] } as T;
  }

  return input;
}