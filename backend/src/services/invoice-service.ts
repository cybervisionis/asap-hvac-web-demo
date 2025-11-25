import { randomUUID } from 'crypto';
import { FinalQuote, Invoice, Payment } from '../types/domain.js';
import { getCollection, replaceCollection } from '../data/store.js';
import { applyListQuery, ListQueryOptions, ListResult, RawQuery, parseListQuery } from '../utils/list.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { applyInvoiceUpdate, InvoiceInput, InvoiceUpdateInput, parseInvoice, parseInvoiceUpdate } from '../models/invoice.js';

const COLLECTION = 'invoices';

const listOptions: ListQueryOptions = {
  filterable: ['finalQuoteId', 'paid'],
  sortable: ['dueDate', 'amountDue', 'paid'],
  defaultSort: 'dueDate'
};

async function readInvoices(): Promise<Invoice[]> {
  return getCollection(COLLECTION) as Promise<Invoice[]>;
}

async function ensureFinalQuoteExists(finalQuoteId: string): Promise<void> {
  const finalQuotes = await getCollection('finalQuotes') as FinalQuote[];
  if (!finalQuotes.some((entry) => entry.id === finalQuoteId)) {
    throw new ValidationError('Referenced final quote does not exist.', { finalQuoteId });
  }
}

function assertPaymentReference(InvoiceData: Pick<Invoice, 'paid' | 'paymentRef'>): void {
  if (!InvoiceData.paid) {
    return;
  }

  if (!InvoiceData.paymentRef || InvoiceData.paymentRef.trim().length === 0) {
    throw new ValidationError('paymentRef must be provided when paid is true.', {
      paymentRef: InvoiceData.paymentRef
    });
  }
}

export async function listInvoices(rawQuery: RawQuery): Promise<ListResult<Invoice>> {
  const invoices = await readInvoices();
  const query = parseListQuery(rawQuery, listOptions);
  return applyListQuery(invoices, query);
}

export async function getInvoiceById(id: string): Promise<Invoice> {
  const invoices = await readInvoices();
  const invoice = invoices.find((entry) => entry.id === id);

  if (!invoice) {
    throw new NotFoundError('Invoice', { id });
  }

  return invoice;
}

export async function createInvoice(payload: unknown): Promise<Invoice> {
  const invoices = await readInvoices();
  const input = parseInvoice(payload) as InvoiceInput;

  await ensureFinalQuoteExists(input.finalQuoteId);
  assertPaymentReference(input as Invoice);

  const { id: providedId, paymentRef, ...rest } = input;
  const id = providedId ?? `inv-${randomUUID()}`;

  if (invoices.some((entry) => entry.id === id)) {
    throw new ValidationError('Invoice id must be unique.', { id });
  }

  const invoice: Invoice = {
    id,
    ...rest,
    paymentRef: paymentRef ?? null
  };

  const updated = [...invoices, invoice];
  await replaceCollection(COLLECTION, updated);
  return invoice;
}

export async function updateInvoice(id: string, payload: unknown): Promise<Invoice> {
  const invoices = await readInvoices();
  const index = invoices.findIndex((entry) => entry.id === id);

  if (index === -1) {
    throw new NotFoundError('Invoice', { id });
  }

  const patch = parseInvoiceUpdate(payload) as InvoiceUpdateInput;

  if (patch.finalQuoteId) {
    await ensureFinalQuoteExists(patch.finalQuoteId);
  }

  const draft = { ...invoices[index], ...patch } as Invoice;
  assertPaymentReference(draft);

  if (patch.paymentRef !== undefined && patch.paymentRef !== null) {
    patch.paymentRef = patch.paymentRef.trim();
  }

  const updatedInvoice = applyInvoiceUpdate(invoices[index], patch);
  const updated = [...invoices];
  updated.splice(index, 1, updatedInvoice);
  await replaceCollection(COLLECTION, updated);
  return updatedInvoice;
}

export async function deleteInvoice(id: string): Promise<void> {
  const invoices = await readInvoices();
  const exists = invoices.some((entry) => entry.id === id);

  if (!exists) {
    throw new NotFoundError('Invoice', { id });
  }

  const payments = await getCollection('payments') as Payment[];
  if (payments.some((payment) => payment.invoiceId === id)) {
    throw new ValidationError('Invoice cannot be deleted while related payments exist.', { id });
  }

  const updated = invoices.filter((entry) => entry.id !== id);
  await replaceCollection(COLLECTION, updated);
}