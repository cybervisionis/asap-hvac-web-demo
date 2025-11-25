import { z } from 'zod';
import { Inspection } from '../types/domain.js';
import { buildUpdateSchema, parseWithSchema } from '../utils/schema.js';

const severityEnum = z.enum(['low', 'moderate', 'high']);

const findingSchema = z.object({
  code: z.string().min(1, 'code is required.'),
  description: z.string().min(1, 'description is required.'),
  severity: severityEnum
});

const adjustmentSchema = z.object({
  description: z.string().min(1, 'description is required.'),
  cost: z.number().nonnegative('cost must be zero or greater.')
});

const coreSchema = z.object({
  quoteRequestId: z.string().min(1, 'quoteRequestId is required.'),
  technician: z.string().min(1, 'technician is required.'),
  findings: z.array(findingSchema).min(1, 'At least one finding is required.'),
  adjustments: z.array(adjustmentSchema).optional(),
  recommendedServices: z.array(z.string().min(1)).optional()
});

const createSchema = coreSchema.extend({
  id: z.string().min(1).optional()
});

const updateSchema = buildUpdateSchema(coreSchema);

export type InspectionInput = z.infer<typeof createSchema>;
export type InspectionUpdateInput = z.infer<typeof updateSchema>;

export function parseInspection(payload: unknown): InspectionInput {
  return normalizeInspection(parseWithSchema(createSchema, payload, { label: 'Inspection' }));
}

export function parseInspectionUpdate(payload: unknown): InspectionUpdateInput {
  return parseWithSchema(updateSchema, payload, { label: 'Inspection update' });
}

export function applyInspectionUpdate(existing: Inspection, changes: InspectionUpdateInput): Inspection {
  return {
    ...existing,
    ...changes,
    findings: changes.findings ?? existing.findings,
    adjustments: changes.adjustments ?? existing.adjustments,
    recommendedServices: changes.recommendedServices ?? existing.recommendedServices
  };
}

function normalizeInspection<T extends Partial<Inspection>>(input: T): T {
  return {
    ...input,
    adjustments: input.adjustments ?? [],
    recommendedServices: input.recommendedServices ?? []
  };
}