import { randomUUID } from 'crypto';
import { MaintenancePlan } from '../types/domain.js';
import { getCollection, replaceCollection } from '../data/store.js';
import { applyListQuery, ListQueryOptions, ListResult, RawQuery, parseListQuery } from '../utils/list.js';
import { NotFoundError, ValidationError } from '../utils/errors.js';
import {
  applyMaintenancePlanUpdate,
  MaintenancePlanInput,
  MaintenancePlanUpdateInput,
  parseMaintenancePlan,
  parseMaintenancePlanUpdate
} from '../models/maintenance-plan.js';

const COLLECTION = 'maintenancePlans';
const listOptions: ListQueryOptions = {
  filterable: ['planTier'],
  sortable: ['planTier', 'annualFee', 'partsDiscountPct'],
  defaultSort: 'annualFee'
};

async function readPlans(): Promise<MaintenancePlan[]> {
  return getCollection(COLLECTION) as Promise<MaintenancePlan[]>;
}

export async function listMaintenancePlans(rawQuery: RawQuery): Promise<ListResult<MaintenancePlan>> {
  const plans = await readPlans();
  const query = parseListQuery(rawQuery, listOptions);
  return applyListQuery(plans, query);
}

export async function getMaintenancePlanById(id: string): Promise<MaintenancePlan> {
  const plans = await readPlans();
  const plan = plans.find((item) => item.id === id);

  if (!plan) {
    throw new NotFoundError('MaintenancePlan', { id });
  }

  return plan;
}

export async function createMaintenancePlan(payload: unknown): Promise<MaintenancePlan> {
  const plans = await readPlans();
  const input = parseMaintenancePlan(payload) as MaintenancePlanInput;

  const { id: providedId, ...rest } = input;
  const id = providedId ?? `plan-${randomUUID()}`;

  if (plans.some((plan) => plan.id === id)) {
    throw new ValidationError('MaintenancePlan id must be unique.', { id });
  }

  const planTier = rest.planTier.trim();
  if (plans.some((plan) => plan.planTier.toLowerCase() === planTier.toLowerCase())) {
    throw new ValidationError('MaintenancePlan planTier must be unique.', { planTier });
  }

  const newPlan: MaintenancePlan = {
    id,
    ...rest,
    planTier,
    extras: rest.extras ?? []
  };

  const updated = [...plans, newPlan];
  await replaceCollection(COLLECTION, updated);
  return newPlan;
}

export async function updateMaintenancePlan(id: string, payload: unknown): Promise<MaintenancePlan> {
  const plans = await readPlans();
  const index = plans.findIndex((plan) => plan.id === id);

  if (index === -1) {
    throw new NotFoundError('MaintenancePlan', { id });
  }

  const patch = parseMaintenancePlanUpdate(payload) as MaintenancePlanUpdateInput;

  if (patch.planTier) {
    const normalizedTier = patch.planTier.trim();
    const duplicateTier = plans.find(
      (plan) => plan.planTier.toLowerCase() === normalizedTier.toLowerCase() && plan.id !== id
    );
    if (duplicateTier) {
      throw new ValidationError('MaintenancePlan planTier must be unique.', { planTier: normalizedTier });
    }
    patch.planTier = normalizedTier;
  }

  const updatedPlan = applyMaintenancePlanUpdate(plans[index], patch);
  const updated = [...plans];
  updated.splice(index, 1, updatedPlan);
  await replaceCollection(COLLECTION, updated);
  return updatedPlan;
}

export async function deleteMaintenancePlan(id: string): Promise<void> {
  const plans = await readPlans();
  const exists = plans.some((plan) => plan.id === id);

  if (!exists) {
    throw new NotFoundError('MaintenancePlan', { id });
  }

  const updated = plans.filter((plan) => plan.id !== id);
  await replaceCollection(COLLECTION, updated);
}