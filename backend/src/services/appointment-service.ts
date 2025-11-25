import { randomUUID } from 'crypto';
import { Appointment, QuoteRequest } from '../types/domain.js';
import { getCollection, replaceCollection } from '../data/store.js';
import { applyListQuery, ListQueryOptions, ListResult, RawQuery, parseListQuery } from '../utils/list.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import {
  applyAppointmentUpdate,
  AppointmentInput,
  AppointmentUpdateInput,
  parseAppointment,
  parseAppointmentUpdate
} from '../models/appointment.js';

const COLLECTION = 'appointments';

const listOptions: ListQueryOptions = {
  filterable: ['status', 'technician', 'quoteRequestId'],
  sortable: ['scheduledDate', 'technician', 'status'],
  defaultSort: 'scheduledDate'
};

async function readAppointments(): Promise<Appointment[]> {
  return getCollection(COLLECTION) as Promise<Appointment[]>;
}

async function ensureQuoteRequestExists(quoteRequestId: string): Promise<void> {
  const quoteRequests = await getCollection('quoteRequests') as QuoteRequest[];
  const exists = quoteRequests.some((entry) => entry.id === quoteRequestId);

  if (!exists) {
    throw new ValidationError('Referenced quote request does not exist.', { quoteRequestId });
  }
}

export async function listAppointments(rawQuery: RawQuery): Promise<ListResult<Appointment>> {
  const appointments = await readAppointments();
  const query = parseListQuery(rawQuery, listOptions);
  return applyListQuery(appointments, query);
}

export async function getAppointmentById(id: string): Promise<Appointment> {
  const appointments = await readAppointments();
  const appointment = appointments.find((entry) => entry.id === id);

  if (!appointment) {
    throw new NotFoundError('Appointment', { id });
  }

  return appointment;
}

export async function createAppointment(payload: unknown): Promise<Appointment> {
  const appointments = await readAppointments();
  const input = parseAppointment(payload) as AppointmentInput;

  await ensureQuoteRequestExists(input.quoteRequestId);

  const { id: providedId, ...rest } = input;
  const id = providedId ?? `appt-${randomUUID()}`;

  if (appointments.some((entry) => entry.id === id)) {
    throw new ValidationError('Appointment id must be unique.', { id });
  }

  const appointment: Appointment = {
    id,
    ...rest,
    technician: rest.technician.trim()
  };

  const updated = [...appointments, appointment];
  await replaceCollection(COLLECTION, updated);
  return appointment;
}

export async function updateAppointment(id: string, payload: unknown): Promise<Appointment> {
  const appointments = await readAppointments();
  const index = appointments.findIndex((entry) => entry.id === id);

  if (index === -1) {
    throw new NotFoundError('Appointment', { id });
  }

  const patch = parseAppointmentUpdate(payload) as AppointmentUpdateInput;

  if (patch.quoteRequestId) {
    await ensureQuoteRequestExists(patch.quoteRequestId);
  }

  if (patch.technician) {
    patch.technician = patch.technician.trim();
  }

  const updatedAppointment = applyAppointmentUpdate(appointments[index], patch);
  const updated = [...appointments];
  updated.splice(index, 1, updatedAppointment);
  await replaceCollection(COLLECTION, updated);
  return updatedAppointment;
}

export async function deleteAppointment(id: string): Promise<void> {
  const appointments = await readAppointments();
  const exists = appointments.some((entry) => entry.id === id);

  if (!exists) {
    throw new NotFoundError('Appointment', { id });
  }

  const updated = appointments.filter((entry) => entry.id !== id);
  await replaceCollection(COLLECTION, updated);
}