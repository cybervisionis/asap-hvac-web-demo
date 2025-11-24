import { randomUUID } from 'crypto';
import { getCollection, replaceCollection } from '../data/store.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import { parseCustomerPayload } from '../models/customer.js';

const COLLECTION = 'customers';

export async function listCustomers() {
  return getCollection(COLLECTION);
}

export async function getCustomerById(id) {
  const customers = await getCollection(COLLECTION);
  const customer = customers.find((item) => item.id === id);

  if (!customer) {
    throw new NotFoundError('Customer', { id });
  }

  return customer;
}

export async function createCustomer(payload) {
  const customers = await getCollection(COLLECTION);
  const customerInput = parseCustomerPayload(payload);

  const duplicateEmail = customers.find((item) => item.email.toLowerCase() === customerInput.email.toLowerCase());
  if (duplicateEmail) {
    throw new ValidationError('Customer email must be unique.', { email: customerInput.email });
  }

  const id = payload.id ?? `cust-${randomUUID()}`;
  const duplicateId = customers.find((item) => item.id === id);

  if (duplicateId) {
    throw new ValidationError('Customer id must be unique.', { id });
  }
  const newCustomer = { id, ...customerInput };
  const updatedCustomers = [...customers, newCustomer];
  await replaceCollection(COLLECTION, updatedCustomers);

  return newCustomer;
}

export async function updateCustomer(id, payload) {
  const customers = await getCollection(COLLECTION);
  const index = customers.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new NotFoundError('Customer', { id });
  }

  const existingCustomer = customers[index];
  const updatePatch = parseCustomerPayload(payload, { partial: true });

  if (updatePatch.email && updatePatch.email.toLowerCase() !== existingCustomer.email.toLowerCase()) {
    const duplicateEmail = customers.find((item) => item.email.toLowerCase() === updatePatch.email.toLowerCase() && item.id !== id);
    if (duplicateEmail) {
      throw new ValidationError('Customer email must be unique.', { email: updatePatch.email });
    }
  }

  const updatedCustomer = { ...existingCustomer };
  
  if (updatePatch.name !== null) updatedCustomer.name = updatePatch.name;
  if (updatePatch.primaryAddress !== null) updatedCustomer.primaryAddress = updatePatch.primaryAddress;
  if (updatePatch.email !== null) updatedCustomer.email = updatePatch.email;
  if (updatePatch.phone !== null) updatedCustomer.phone = updatePatch.phone;
  if (updatePatch.planTier !== null) updatedCustomer.planTier = updatePatch.planTier;

  const updatedCustomers = [...customers];
  updatedCustomers.splice(index, 1, updatedCustomer);
  await replaceCollection(COLLECTION, updatedCustomers);

  return updatedCustomer;
}

export async function deleteCustomer(id) {
  const customers = await getCollection(COLLECTION);
  const index = customers.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new NotFoundError('Customer', { id });
  }

  const updatedCustomers = customers.filter((item) => item.id !== id);
  await replaceCollection(COLLECTION, updatedCustomers);
}
