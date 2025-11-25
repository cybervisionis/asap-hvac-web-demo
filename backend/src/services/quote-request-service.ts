import { randomUUID } from 'crypto';
import { Appointment, FinalQuote, Inspection, QuoteRequest } from '../types/domain.js';
import { getCollection, replaceCollection } from '../data/store.js';
import { applyListQuery, ListQueryOptions, ListResult, RawQuery, parseListQuery } from '../utils/list.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import {
  applyQuoteRequestUpdate,
  parseQuoteRequest,
  parseQuoteRequestUpdate,
  QuoteRequestInput,
  QuoteRequestUpdateInput
} from '../models/quote-request.js';

const COLLECTION = 'quoteRequests';

const listOptions: ListQueryOptions = {
  filterable: ['status', 'urgency', 'serviceType', 'customerName'],
  sortable: ['requestedDate', 'customerName', 'status', 'urgency'],
  defaultSort: 'requestedDate',
  defaultSortOrder: 'desc'
};

async function readQuoteRequests(): Promise<QuoteRequest[]> {
  return getCollection(COLLECTION) as Promise<QuoteRequest[]>;
}

export async function listQuoteRequests(rawQuery: RawQuery): Promise<ListResult<QuoteRequest>> {
  const quoteRequests = await readQuoteRequests();
  const query = parseListQuery(rawQuery, listOptions);
  return applyListQuery(quoteRequests, query);
}

export async function getQuoteRequestById(id: string): Promise<QuoteRequest> {
  const quoteRequests = await readQuoteRequests();
  const quoteRequest = quoteRequests.find((entry) => entry.id === id);

  if (!quoteRequest) {
    throw new NotFoundError('QuoteRequest', { id });
  }

  return quoteRequest;
}

export async function createQuoteRequest(payload: unknown): Promise<QuoteRequest> {
  const quoteRequests = await readQuoteRequests();
  const input = parseQuoteRequest(payload) as QuoteRequestInput;

  const { id: providedId, ...rest } = input;
  const id = providedId ?? `qr-${randomUUID()}`;

  if (quoteRequests.some((entry) => entry.id === id)) {
    throw new ValidationError('QuoteRequest id must be unique.', { id });
  }

  const normalizedCustomer = rest.customerName.trim();
  const quoteRequest: QuoteRequest = {
    id,
    ...rest,
    customerName: normalizedCustomer,
    symptoms: rest.symptoms ?? []
  };

  const updated = [...quoteRequests, quoteRequest];
  await replaceCollection(COLLECTION, updated);
  return quoteRequest;
}

export async function updateQuoteRequest(id: string, payload: unknown): Promise<QuoteRequest> {
  const quoteRequests = await readQuoteRequests();
  const index = quoteRequests.findIndex((entry) => entry.id === id);

  if (index === -1) {
    throw new NotFoundError('QuoteRequest', { id });
  }

  const patch = parseQuoteRequestUpdate(payload) as QuoteRequestUpdateInput;

  if (patch.customerName) {
    patch.customerName = patch.customerName.trim();
  }

  const updatedQuoteRequest = applyQuoteRequestUpdate(quoteRequests[index], patch);
  const updated = [...quoteRequests];
  updated.splice(index, 1, updatedQuoteRequest);
  await replaceCollection(COLLECTION, updated);
  return updatedQuoteRequest;
}

export async function deleteQuoteRequest(id: string): Promise<void> {
  const quoteRequests = await readQuoteRequests();
  const exists = quoteRequests.some((entry) => entry.id === id);

  if (!exists) {
    throw new NotFoundError('QuoteRequest', { id });
  }

  const [appointments, inspections, finalQuotes] = await Promise.all([
    getCollection('appointments') as Promise<Appointment[]>,
    getCollection('inspections') as Promise<Inspection[]>,
    getCollection('finalQuotes') as Promise<FinalQuote[]>
  ]);

  const hasDependents = [appointments, inspections, finalQuotes].some((collection) =>
    collection.some((entry) => entry.quoteRequestId === id)
  );

  if (hasDependents) {
    throw new ValidationError('QuoteRequest cannot be deleted while related records exist.', { id });
  }

  const updated = quoteRequests.filter((entry) => entry.id !== id);
  await replaceCollection(COLLECTION, updated);
}