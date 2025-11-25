import { randomUUID } from 'crypto';
import { ServiceOffering } from '../types/domain.js';
import { getCollection, replaceCollection } from '../data/store.js';
import { applyListQuery, ListQueryOptions, ListResult, RawQuery, parseListQuery } from '../utils/list.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import {
  applyServiceUpdate,
  parseServiceOffering,
  parseServiceOfferingUpdate,
  ServiceOfferingUpdateInput
} from '../models/service-offering.js';

const COLLECTION = 'services';
const listOptions: ListQueryOptions = {
  filterable: ['category', 'name'],
  sortable: ['name', 'category'],
  defaultSort: 'name'
};

async function readServices(): Promise<ServiceOffering[]> {
  return getCollection(COLLECTION) as Promise<ServiceOffering[]>;
}

export async function listServiceOfferings(rawQuery: RawQuery): Promise<ListResult<ServiceOffering>> {
  const services = await readServices();
  const query = parseListQuery(rawQuery, listOptions);
  return applyListQuery(services, query);
}

export async function getServiceOfferingById(id: string): Promise<ServiceOffering> {
  const services = await readServices();
  const match = services.find((svc) => svc.id === id);

  if (!match) {
    throw new NotFoundError('ServiceOffering', { id });
  }

  return match;
}

export async function createServiceOffering(payload: unknown): Promise<ServiceOffering> {
  const services = await readServices();
  const input = parseServiceOffering(payload);

  const { id: providedId, ...rest } = input;
  const id = providedId ?? `svc-${randomUUID()}`;

  if (services.some((svc) => svc.id === id)) {
    throw new ValidationError('ServiceOffering id must be unique.', { id });
  }

  const newService: ServiceOffering = { id, ...rest } as ServiceOffering;
  const updated = [...services, newService];
  await replaceCollection(COLLECTION, updated);
  return newService;
}

export async function updateServiceOffering(id: string, payload: unknown): Promise<ServiceOffering> {
  const services = await readServices();
  const index = services.findIndex((svc) => svc.id === id);

  if (index === -1) {
    throw new NotFoundError('ServiceOffering', { id });
  }

  const patch = parseServiceOfferingUpdate(payload) as ServiceOfferingUpdateInput;
  const updatedService = applyServiceUpdate(services[index], patch);
  const updated = [...services];
  updated.splice(index, 1, updatedService);
  await replaceCollection(COLLECTION, updated);
  return updatedService;
}

export async function deleteServiceOffering(id: string): Promise<void> {
  const services = await readServices();
  const exists = services.some((svc) => svc.id === id);

  if (!exists) {
    throw new NotFoundError('ServiceOffering', { id });
  }

  const updated = services.filter((svc) => svc.id !== id);
  await replaceCollection(COLLECTION, updated);
}