import { randomUUID } from 'crypto';
import { Customer } from '../types/domain.js';
import { getCollection, replaceCollection } from '../data/store.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { CustomerInput, CustomerUpdateInput, parseCustomerPayload } from '../models/customer.js';
import { applyListQuery, ListQueryOptions, ListResult, RawQuery, parseListQuery } from '../utils/list.js';

const COLLECTION = 'customers';
const listOptions: ListQueryOptions = {
  filterable: ['planTier', 'email'],
  sortable: ['name', 'email'],
  defaultSort: 'name'
};

export async function listCustomers(rawQuery: RawQuery): Promise<ListResult<Customer>> {
  const customers = await getCollection('customers') as Customer[];
  const query = parseListQuery(rawQuery, listOptions);
  return applyListQuery(customers, query);
}

export async function getCustomerById(id: string): Promise<Customer> {
  const customers = await getCollection('customers') as Customer[];
  const customer = customers.find((item) => item.id === id);

  if (!customer) {
    throw new NotFoundError('Customer', { id });
  }

  return customer;
}

export async function createCustomer(payload: unknown): Promise<Customer> {
  const customers = await getCollection('customers') as Customer[];
  const customerInput = parseCustomerPayload(payload) as CustomerInput;

  const duplicateEmail = customers.find((item) => item.email.toLowerCase() === customerInput.email.toLowerCase());
  if (duplicateEmail) {
    throw new ValidationError('Customer email must be unique.', { email: customerInput.email });
  }

  const id = (payload as Partial<Customer>).id ?? `cust-${randomUUID()}`;
  const duplicateId = customers.find((item) => item.id === id);
  if (duplicateId) {
    throw new ValidationError('Customer id must be unique.', { id });
  }

  const newCustomer: Customer = { id, ...customerInput };
  const updatedCustomers = [...customers, newCustomer];
  await replaceCollection(COLLECTION, updatedCustomers);

  return newCustomer;
}

export async function updateCustomer(id: string, payload: unknown): Promise<Customer> {
  const customers = await getCollection('customers') as Customer[];
  const index = customers.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new NotFoundError('Customer', { id });
  }

  const existingCustomer = customers[index];
  const updatePatch = parseCustomerPayload(payload, { partial: true }) as CustomerUpdateInput;

  if (updatePatch.email && updatePatch.email.toLowerCase() !== existingCustomer.email.toLowerCase()) {
    const duplicateEmail = customers.find(
      (item) => item.email.toLowerCase() === updatePatch.email!.toLowerCase() && item.id !== id
    );
    if (duplicateEmail) {
      throw new ValidationError('Customer email must be unique.', { email: updatePatch.email });
    }
  }

  const updatedCustomer: Customer = { ...existingCustomer };

  if (updatePatch.name !== undefined) updatedCustomer.name = updatePatch.name;
  if (updatePatch.primaryAddress !== undefined) updatedCustomer.primaryAddress = updatePatch.primaryAddress;
  if (updatePatch.email !== undefined) updatedCustomer.email = updatePatch.email;
  if (updatePatch.phone !== undefined) updatedCustomer.phone = updatePatch.phone;
  if (updatePatch.planTier !== undefined) updatedCustomer.planTier = updatePatch.planTier;

  const updatedCustomers = [...customers];
  updatedCustomers.splice(index, 1, updatedCustomer);
  await replaceCollection(COLLECTION, updatedCustomers);

  return updatedCustomer;
}

export async function deleteCustomer(id: string): Promise<void> {
  const customers = await getCollection('customers') as Customer[];
  const index = customers.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new NotFoundError('Customer', { id });
  }

  const updatedCustomers = customers.filter((item) => item.id !== id);
  await replaceCollection(COLLECTION, updatedCustomers);
}
