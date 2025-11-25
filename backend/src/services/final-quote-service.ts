import { randomUUID } from 'crypto';
import { FinalQuote, Invoice, PartsOrder, QuoteRequest } from '../types/domain.js';
import { getCollection, replaceCollection } from '../data/store.js';
import { applyListQuery, ListQueryOptions, ListResult, RawQuery, parseListQuery } from '../utils/list.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import {
  applyFinalQuoteUpdate,
  FinalQuoteInput,
  FinalQuoteUpdateInput,
  parseFinalQuote,
  parseFinalQuoteUpdate
} from '../models/final-quote.js';

const COLLECTION = 'finalQuotes';

const listOptions: ListQueryOptions = {
  filterable: ['quoteRequestId', 'status'],
  sortable: ['status', 'finalTotal', 'expiresOn'],
  defaultSort: 'expiresOn'
};

async function readFinalQuotes(): Promise<FinalQuote[]> {
  return getCollection(COLLECTION) as Promise<FinalQuote[]>;
}

async function ensureQuoteRequestExists(quoteRequestId: string): Promise<void> {
  const quoteRequests = await getCollection('quoteRequests') as QuoteRequest[];
  if (!quoteRequests.some((entry) => entry.id === quoteRequestId)) {
    throw new ValidationError('Referenced quote request does not exist.', { quoteRequestId });
  }
}

function assertTotals(input: Pick<FinalQuote, 'baseEstimate' | 'adjustmentsTotal' | 'finalTotal'>): void {
  if (input.finalTotal < input.baseEstimate + input.adjustmentsTotal) {
    throw new ValidationError('finalTotal must be greater than or equal to baseEstimate + adjustmentsTotal.', {
      baseEstimate: input.baseEstimate,
      adjustmentsTotal: input.adjustmentsTotal,
      finalTotal: input.finalTotal
    });
  }
}

export async function listFinalQuotes(rawQuery: RawQuery): Promise<ListResult<FinalQuote>> {
  const finalQuotes = await readFinalQuotes();
  const query = parseListQuery(rawQuery, listOptions);
  return applyListQuery(finalQuotes, query);
}

export async function getFinalQuoteById(id: string): Promise<FinalQuote> {
  const finalQuotes = await readFinalQuotes();
  const finalQuote = finalQuotes.find((entry) => entry.id === id);

  if (!finalQuote) {
    throw new NotFoundError('FinalQuote', { id });
  }

  return finalQuote;
}

export async function createFinalQuote(payload: unknown): Promise<FinalQuote> {
  const finalQuotes = await readFinalQuotes();
  const input = parseFinalQuote(payload) as FinalQuoteInput;

  await ensureQuoteRequestExists(input.quoteRequestId);
  assertTotals(input as FinalQuote);

  const { id: providedId, ...rest } = input;
  const id = providedId ?? `fq-${randomUUID()}`;

  if (finalQuotes.some((entry) => entry.id === id)) {
    throw new ValidationError('FinalQuote id must be unique.', { id });
  }

  const finalQuote: FinalQuote = {
    id,
    ...rest
  };

  const updated = [...finalQuotes, finalQuote];
  await replaceCollection(COLLECTION, updated);
  return finalQuote;
}

export async function updateFinalQuote(id: string, payload: unknown): Promise<FinalQuote> {
  const finalQuotes = await readFinalQuotes();
  const index = finalQuotes.findIndex((entry) => entry.id === id);

  if (index === -1) {
    throw new NotFoundError('FinalQuote', { id });
  }

  const patch = parseFinalQuoteUpdate(payload) as FinalQuoteUpdateInput;

  if (patch.quoteRequestId) {
    await ensureQuoteRequestExists(patch.quoteRequestId);
  }

  const next = { ...finalQuotes[index], ...patch } as FinalQuote;
  assertTotals(next);

  const updatedFinalQuote = applyFinalQuoteUpdate(finalQuotes[index], patch);
  const updated = [...finalQuotes];
  updated.splice(index, 1, updatedFinalQuote);
  await replaceCollection(COLLECTION, updated);
  return updatedFinalQuote;
}

export async function deleteFinalQuote(id: string): Promise<void> {
  const finalQuotes = await readFinalQuotes();
  const exists = finalQuotes.some((entry) => entry.id === id);

  if (!exists) {
    throw new NotFoundError('FinalQuote', { id });
  }

  const [invoices, partsOrders] = await Promise.all([
    getCollection('invoices') as Promise<Invoice[]>,
    getCollection('partsOrders') as Promise<PartsOrder[]>
  ]);

  const hasDependents = invoices.some((invoice) => invoice.finalQuoteId === id)
    || partsOrders.some((order) => order.finalQuoteId === id);

  if (hasDependents) {
    throw new ValidationError('FinalQuote cannot be deleted while related records exist.', { id });
  }

  const updated = finalQuotes.filter((entry) => entry.id !== id);
  await replaceCollection(COLLECTION, updated);
}