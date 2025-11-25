import { access, readFile, writeFile } from 'fs/promises';
import { constants as fsConstants } from 'fs';
import path from 'path';
import { DataSnapshot, Customer } from '../types/domain.js';

const dataFilePath = path.resolve(process.cwd(), 'data', 'data-store.json');

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

let cache: DataSnapshot | null = null;

async function ensureDataFile(): Promise<void> {
  try {
    await access(dataFilePath, fsConstants.F_OK);
  } catch {
    const bootstrap: DataSnapshot = {
      services: [],
      maintenancePlans: [],
      quoteRequests: [],
      appointments: [],
      inspections: [],
      finalQuotes: [],
      invoices: [],
      payments: [],
      partsOrders: [],
      customers: [],
      businessSettings: {
        cancellationWindowHours: 24,
        cancellationFee: 0,
        quoteExpiryDays: 14,
        serviceFeeRange: '$0-$0',
        schedulingWindow: 'Mon–Sat 8:00-18:00'
      }
    };
    cache = clone(bootstrap);
    await writeFile(dataFilePath, JSON.stringify(cache, null, 2), 'utf-8');
  }
}

async function readSnapshot(): Promise<DataSnapshot> {
  if (!cache) {
    await ensureDataFile();
    const raw = await readFile(dataFilePath, 'utf-8');
    cache = JSON.parse(raw) as DataSnapshot;
  }

  return cache;
}

async function writeSnapshot(snapshot: DataSnapshot): Promise<DataSnapshot> {
  cache = clone(snapshot);
  await writeFile(dataFilePath, JSON.stringify(cache, null, 2), 'utf-8');
  return cache;
}

export async function getDataSnapshot(): Promise<DataSnapshot> {
  const data = await readSnapshot();
  return clone(data);
}

export async function saveDataSnapshot(snapshot: DataSnapshot): Promise<DataSnapshot> {
  await writeSnapshot(snapshot);
  return getDataSnapshot();
}

export async function getCollection<T extends keyof DataSnapshot>(name: T): Promise<DataSnapshot[T]> {
  const data = await readSnapshot();
  const collection = data[name];
  return clone(collection);
}

export async function replaceCollection<T extends keyof DataSnapshot>(name: T, collection: DataSnapshot[T]): Promise<DataSnapshot[T]> {
  const data = await readSnapshot();
  data[name] = clone(collection);
  await writeSnapshot(data);
  return getCollection(name);
}

export async function upsertCustomerList(customers: Customer[]): Promise<Customer[]> {
  return replaceCollection('customers', customers);
}

export { dataFilePath };
