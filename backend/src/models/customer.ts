import { Customer } from '../types/domain.js';
import { ValidationError } from '../utils/errors.js';

export interface CustomerInput {
  name: string;
  primaryAddress: string;
  email: string;
  phone: string;
  planTier?: string | null;
}

export type CustomerUpdateInput = Partial<CustomerInput>;

type CustomerPayload = Partial<Customer> & Record<string, unknown>;

type AllowedField = keyof CustomerInput;

const REQUIRED_FIELDS: AllowedField[] = ['name', 'primaryAddress', 'email', 'phone'];
const OPTIONAL_FIELDS: AllowedField[] = ['planTier'];
const ALLOWED_FIELDS = new Set<AllowedField>([...REQUIRED_FIELDS, ...OPTIONAL_FIELDS]);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+()\-\s]{7,}$/;

function assertAllowedFields(payload: CustomerPayload): void {
  const disallowed = Object.keys(payload).filter((key) => !ALLOWED_FIELDS.has(key as keyof CustomerInput));

  if (disallowed.length > 0) {
    throw new ValidationError('Customer payload contains unsupported properties.', disallowed);
  }
}

function assertRequiredFields(payload: CustomerInput): void {
  const missing = REQUIRED_FIELDS.filter((field) =>
    payload[field] === undefined || payload[field] === null || payload[field] === ''
  );

  if (missing.length > 0) {
    throw new ValidationError('Customer payload is missing required fields.', missing);
  }
}

function assertFieldFormats(payload: CustomerInput | CustomerUpdateInput): void {
  if (payload.email && !emailPattern.test(payload.email)) {
    throw new ValidationError('Customer email format is invalid.', { email: payload.email });
  }

  if (payload.phone && !phonePattern.test(payload.phone)) {
    throw new ValidationError('Customer phone format is invalid.', { phone: payload.phone });
  }
}

const isAllowedField = (field: string): field is AllowedField => ALLOWED_FIELDS.has(field as AllowedField);

function sanitizePayload(payload: CustomerPayload): CustomerUpdateInput {
  return Object.entries(payload).reduce<CustomerUpdateInput>((acc, [key, value]) => {
    if (!isAllowedField(key) || value === undefined) {
      return acc;
    }

    if (key === 'planTier') {
      acc.planTier = value === null ? null : String(value);
      return acc;
    }

    if (value !== null) {
      acc[key] = String(value);
    }

    return acc;
  }, {});
}

export function parseCustomerPayload(payload: unknown): CustomerInput;
export function parseCustomerPayload(payload: unknown, options: { partial: true }): CustomerUpdateInput;
export function parseCustomerPayload(
  payload: unknown,
  { partial = false }: { partial?: boolean } = {}
): CustomerInput | CustomerUpdateInput {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new ValidationError('Customer payload must be an object.');
  }

  const sanitized = sanitizePayload(payload as CustomerPayload);

  assertAllowedFields(payload as CustomerPayload);

  if (!partial) {
    assertRequiredFields(sanitized as CustomerInput);
  }

  assertFieldFormats(sanitized);

  return sanitized as CustomerInput | CustomerUpdateInput;
}
