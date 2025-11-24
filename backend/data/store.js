import { access, readFile, writeFile } from 'fs/promises';
import { constants as fsConstants } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFilePath = path.resolve(__dirname, 'data-store.json');

const clone = (value) => JSON.parse(JSON.stringify(value));

let cache = null;

async function ensureDataFile() {
  try {
    await access(dataFilePath, fsConstants.F_OK);
  } catch (error) {
    const bootstrap = { customers: [] };
    cache = clone(bootstrap);
    await writeFile(dataFilePath, JSON.stringify(cache, null, 2), 'utf-8');
  }
}

async function readSnapshot() {
  if (!cache) {
    await ensureDataFile();
    const raw = await readFile(dataFilePath, 'utf-8');
    cache = JSON.parse(raw);
  }

  return cache;
}

async function writeSnapshot(snapshot) {
  cache = clone(snapshot);
  await writeFile(dataFilePath, JSON.stringify(cache, null, 2), 'utf-8');
  return cache;
}

export async function getDataSnapshot() {
  const data = await readSnapshot();
  return clone(data);
}

export async function saveDataSnapshot(snapshot) {
  await writeSnapshot(snapshot);
  return getDataSnapshot();
}

export async function getCollection(name) {
  const data = await readSnapshot();
  const collection = Array.isArray(data[name]) ? data[name] : [];
  return clone(collection);
}

export async function replaceCollection(name, collection) {
  const data = await readSnapshot();
  data[name] = clone(collection);
  await writeSnapshot(data);
  return getCollection(name);
}

export function getDataFilePath() {
  return dataFilePath;
}
