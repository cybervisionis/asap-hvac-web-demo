import { randomUUID } from 'crypto';
import { Invoice, Payment } from '../types/domain.js';
import { getCollection, replaceCollection } from '../data/store.js';
import { applyListQuery, ListQueryOptions, ListResult, RawQuery, parseListQuery } from '../utils/list.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { applyPaymentUpdate, PaymentInput, PaymentUpdateInput, parsePayment, parsePaymentUpdate } from '../models/payment.js';

const COLLECTION = 'payments';

const listOptions: ListQueryOptions = {
  filterable: ['invoiceId', 'method'],
  sortable: ['paidOn', 'amount'],
  defaultSort: 'paidOn',
  defaultSortOrder: 'desc'
};

async function readPayments(): Promise<Payment[]> {
  return getCollection(COLLECTION) as Promise<Payment[]>;
}

async function ensureInvoiceExists(invoiceId: string): Promise<void> {
  const invoices = await getCollection('invoices') as Invoice[];
  if (!invoices.some((entry) => entry.id === invoiceId)) {
    throw new ValidationError('Referenced invoice does not exist.', { invoiceId });
  }
}

export async function listPayments(rawQuery: RawQuery): Promise<ListResult<Payment>> {
  const payments = await readPayments();
  const query = parseListQuery(rawQuery, listOptions);
  return applyListQuery(payments, query);
}

export async function getPaymentById(id: string): Promise<Payment> {
  const payments = await readPayments();
  const payment = payments.find((entry) => entry.id === id);

  if (!payment) {
    throw new NotFoundError('Payment', { id });
  }

  return payment;
}

export async function createPayment(payload: unknown): Promise<Payment> {
  const payments = await readPayments();
  const input = parsePayment(payload) as PaymentInput;

  await ensureInvoiceExists(input.invoiceId);

  const { id: providedId, reference, notes, ...rest } = input;
  const id = providedId ?? `pay-${randomUUID()}`;

  if (payments.some((entry) => entry.id === id)) {
    throw new ValidationError('Payment id must be unique.', { id });
  }

  const payment: Payment = {
    id,
    ...rest,
    reference: reference ?? null,
    notes: notes ?? null
  };

  const updated = [...payments, payment];
  await replaceCollection(COLLECTION, updated);
  return payment;
}

export async function updatePayment(id: string, payload: unknown): Promise<Payment> {
  const payments = await readPayments();
  const index = payments.findIndex((entry) => entry.id === id);

  if (index === -1) {
    throw new NotFoundError('Payment', { id });
  }

  const patch = parsePaymentUpdate(payload) as PaymentUpdateInput;

  if (patch.invoiceId) {
    await ensureInvoiceExists(patch.invoiceId);
  }

  if (patch.reference !== undefined && patch.reference !== null) {
    patch.reference = patch.reference.trim();
  }

  if (patch.notes !== undefined && patch.notes !== null) {
    patch.notes = patch.notes.trim();
  }

  const updatedPayment = applyPaymentUpdate(payments[index], patch);
  const updated = [...payments];
  updated.splice(index, 1, updatedPayment);
  await replaceCollection(COLLECTION, updated);
  return updatedPayment;
}

export async function deletePayment(id: string): Promise<void> {
  const payments = await readPayments();
  const exists = payments.some((entry) => entry.id === id);

  if (!exists) {
    throw new NotFoundError('Payment', { id });
  }

  const updated = payments.filter((entry) => entry.id !== id);
  await replaceCollection(COLLECTION, updated);
}