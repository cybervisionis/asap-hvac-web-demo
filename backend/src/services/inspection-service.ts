import { randomUUID } from 'crypto';
import { Inspection, QuoteRequest } from '../types/domain.js';
import { getCollection, replaceCollection } from '../data/store.js';
import { applyListQuery, ListQueryOptions, ListResult, RawQuery, parseListQuery } from '../utils/list.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import {
  applyInspectionUpdate,
  InspectionInput,
  InspectionUpdateInput,
  parseInspection,
  parseInspectionUpdate
} from '../models/inspection.js';

const COLLECTION = 'inspections';

const listOptions: ListQueryOptions = {
  filterable: ['quoteRequestId', 'technician'],
  sortable: ['technician'],
  defaultSort: 'technician'
};

async function readInspections(): Promise<Inspection[]> {
  return getCollection(COLLECTION) as Promise<Inspection[]>;
}

async function ensureQuoteRequestExists(quoteRequestId: string): Promise<void> {
  const quoteRequests = await getCollection('quoteRequests') as QuoteRequest[];
  if (!quoteRequests.some((entry) => entry.id === quoteRequestId)) {
    throw new ValidationError('Referenced quote request does not exist.', { quoteRequestId });
  }
}

export async function listInspections(rawQuery: RawQuery): Promise<ListResult<Inspection>> {
  const inspections = await readInspections();
  const query = parseListQuery(rawQuery, listOptions);
  return applyListQuery(inspections, query);
}

export async function getInspectionById(id: string): Promise<Inspection> {
  const inspections = await readInspections();
  const inspection = inspections.find((entry) => entry.id === id);

  if (!inspection) {
    throw new NotFoundError('Inspection', { id });
  }

  return inspection;
}

export async function createInspection(payload: unknown): Promise<Inspection> {
  const inspections = await readInspections();
  const input = parseInspection(payload) as InspectionInput;

  await ensureQuoteRequestExists(input.quoteRequestId);

  const { id: providedId, ...rest } = input;
  const id = providedId ?? `insp-${randomUUID()}`;

  if (inspections.some((entry) => entry.id === id)) {
    throw new ValidationError('Inspection id must be unique.', { id });
  }

  const inspection: Inspection = {
    id,
    ...rest,
    technician: rest.technician.trim(),
    findings: rest.findings,
    adjustments: rest.adjustments ?? [],
    recommendedServices: rest.recommendedServices ?? []
  };

  const updated = [...inspections, inspection];
  await replaceCollection(COLLECTION, updated);
  return inspection;
}

export async function updateInspection(id: string, payload: unknown): Promise<Inspection> {
  const inspections = await readInspections();
  const index = inspections.findIndex((entry) => entry.id === id);

  if (index === -1) {
    throw new NotFoundError('Inspection', { id });
  }

  const patch = parseInspectionUpdate(payload) as InspectionUpdateInput;

  if (patch.quoteRequestId) {
    await ensureQuoteRequestExists(patch.quoteRequestId);
  }

  if (patch.technician) {
    patch.technician = patch.technician.trim();
  }

  const updatedInspection = applyInspectionUpdate(inspections[index], patch);
  const updated = [...inspections];
  updated.splice(index, 1, updatedInspection);
  await replaceCollection(COLLECTION, updated);
  return updatedInspection;
}

export async function deleteInspection(id: string): Promise<void> {
  const inspections = await readInspections();
  const exists = inspections.some((entry) => entry.id === id);

  if (!exists) {
    throw new NotFoundError('Inspection', { id });
  }

  const updated = inspections.filter((entry) => entry.id !== id);
  await replaceCollection(COLLECTION, updated);
}