import { z } from 'zod';
import { parseWithSchema, buildUpdateSchema } from '../utils/schema.js';
import { ServiceOffering } from '../types/domain.js';

const serviceCoreSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  category: z.string().min(1, 'Category is required.'),
  basePriceRange: z.string().min(1, 'Base price range is required.'),
  description: z.string().min(1, 'Description is required.')
});

const createSchema = serviceCoreSchema.extend({
  id: z.string().min(1).optional()
});

const updateSchema = buildUpdateSchema(serviceCoreSchema);

export type ServiceOfferingInput = z.infer<typeof createSchema>;
export type ServiceOfferingUpdateInput = z.infer<typeof updateSchema>;

export function parseServiceOffering(payload: unknown): ServiceOfferingInput {
  return parseWithSchema(createSchema, payload, { label: 'ServiceOffering' });
}

export function parseServiceOfferingUpdate(payload: unknown): ServiceOfferingUpdateInput {
  return parseWithSchema(updateSchema, payload, { label: 'ServiceOffering update' });
}

export function applyServiceUpdate(existing: ServiceOffering, changes: ServiceOfferingUpdateInput): ServiceOffering {
  return {
    ...existing,
    ...changes
  };
}