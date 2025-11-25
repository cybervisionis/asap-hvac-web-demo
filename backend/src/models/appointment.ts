import { z } from 'zod';
import { Appointment } from '../types/domain.js';
import { buildUpdateSchema, isISODateString, parseWithSchema } from '../utils/schema.js';

const statusEnum = z.enum(['scheduled', 'completed', 'canceled']);

const coreSchema = z.object({
  quoteRequestId: z.string().min(1, 'quoteRequestId is required.'),
  scheduledDate: z
    .string()
    .refine((value) => isISODateString(value), 'scheduledDate must be a valid ISO date string.'),
  window: z.string().min(1, 'window is required.'),
  technician: z.string().min(1, 'technician is required.'),
  status: statusEnum
});

const createSchema = coreSchema.extend({
  id: z.string().min(1).optional()
});

const updateSchema = buildUpdateSchema(coreSchema);

export type AppointmentInput = z.infer<typeof createSchema>;
export type AppointmentUpdateInput = z.infer<typeof updateSchema>;

export function parseAppointment(payload: unknown): AppointmentInput {
  return parseWithSchema(createSchema, payload, { label: 'Appointment' });
}

export function parseAppointmentUpdate(payload: unknown): AppointmentUpdateInput {
  return parseWithSchema(updateSchema, payload, { label: 'Appointment update' });
}

export function applyAppointmentUpdate(existing: Appointment, changes: AppointmentUpdateInput): Appointment {
  return {
    ...existing,
    ...changes
  };
}