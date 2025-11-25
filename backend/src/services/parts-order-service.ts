import { randomUUID } from 'crypto';
import { FinalQuote, PartsOrder } from '../types/domain.js';
import { getCollection, replaceCollection } from '../data/store.js';
import { applyListQuery, ListQueryOptions, ListResult, RawQuery, parseListQuery } from '../utils/list.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import {
  applyPartsOrderUpdate,
  PartsOrderInput,
  PartsOrderUpdateInput,
  parsePartsOrder,
  parsePartsOrderUpdate
} from '../models/parts-order.js';

const COLLECTION = 'partsOrders';

const listOptions: ListQueryOptions = {
  filterable: ['finalQuoteId', 'status'],
  sortable: ['status', 'totalCost'],
  defaultSort: 'status'
};

async function readPartsOrders(): Promise<PartsOrder[]> {
  return getCollection(COLLECTION) as Promise<PartsOrder[]>;
}

async function ensureFinalQuoteExists(finalQuoteId: string): Promise<void> {
  const finalQuotes = await getCollection('finalQuotes') as FinalQuote[];
  if (!finalQuotes.some((entry) => entry.id === finalQuoteId)) {
    throw new ValidationError('Referenced final quote does not exist.', { finalQuoteId });
  }
}

function calculateTotalCost(order: PartsOrderInput | PartsOrderUpdateInput): number {
  if (!order.items) {
    return 0;
  }

  return order.items.reduce((sum, item) => sum + item.qty * item.costEach, 0);
}

function assertTotalCost(order: PartsOrderInput | PartsOrder): void {
  const expected = calculateTotalCost(order);
  if (Math.abs(order.totalCost - expected) > 0.001) {
    throw new ValidationError('totalCost must equal the sum of item quantities multiplied by costEach.', {
      expectedTotal: expected,
      providedTotal: order.totalCost
    });
  }
}

export async function listPartsOrders(rawQuery: RawQuery): Promise<ListResult<PartsOrder>> {
  const partsOrders = await readPartsOrders();
  const query = parseListQuery(rawQuery, listOptions);
  return applyListQuery(partsOrders, query);
}

export async function getPartsOrderById(id: string): Promise<PartsOrder> {
  const partsOrders = await readPartsOrders();
  const partsOrder = partsOrders.find((entry) => entry.id === id);

  if (!partsOrder) {
    throw new NotFoundError('PartsOrder', { id });
  }

  return partsOrder;
}

export async function createPartsOrder(payload: unknown): Promise<PartsOrder> {
  const partsOrders = await readPartsOrders();
  const input = parsePartsOrder(payload) as PartsOrderInput;

  await ensureFinalQuoteExists(input.finalQuoteId);
  assertTotalCost(input);

  const { id: providedId, notes, etaDate, ...rest } = input;
  const id = providedId ?? `po-${randomUUID()}`;

  if (partsOrders.some((entry) => entry.id === id)) {
    throw new ValidationError('PartsOrder id must be unique.', { id });
  }

  const partsOrder: PartsOrder = {
    id,
    ...rest,
    etaDate: etaDate ?? null,
    notes: notes ?? null
  };

  const updated = [...partsOrders, partsOrder];
  await replaceCollection(COLLECTION, updated);
  return partsOrder;
}

export async function updatePartsOrder(id: string, payload: unknown): Promise<PartsOrder> {
  const partsOrders = await readPartsOrders();
  const index = partsOrders.findIndex((entry) => entry.id === id);

  if (index === -1) {
    throw new NotFoundError('PartsOrder', { id });
  }

  const patch = parsePartsOrderUpdate(payload) as PartsOrderUpdateInput;

  if (patch.finalQuoteId) {
    await ensureFinalQuoteExists(patch.finalQuoteId);
  }

  const draft = { ...partsOrders[index], ...patch } as PartsOrder;
  assertTotalCost(draft);

  if (patch.notes !== undefined && patch.notes !== null) {
    patch.notes = patch.notes.trim();
  }

  const updatedOrder = applyPartsOrderUpdate(partsOrders[index], patch);
  const updated = [...partsOrders];
  updated.splice(index, 1, updatedOrder);
  await replaceCollection(COLLECTION, updated);
  return updatedOrder;
}

export async function deletePartsOrder(id: string): Promise<void> {
  const partsOrders = await readPartsOrders();
  const exists = partsOrders.some((entry) => entry.id === id);

  if (!exists) {
    throw new NotFoundError('PartsOrder', { id });
  }

  const updated = partsOrders.filter((entry) => entry.id !== id);
  await replaceCollection(COLLECTION, updated);
}