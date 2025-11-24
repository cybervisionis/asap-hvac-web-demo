import { ValidationError } from '../utils/errors.js';

const REQUIRED_FIELDS = ['name', 'primaryAddress', 'email', 'phone'];
const OPTIONAL_FIELDS = ['planTier'];
const ALLOWED_FIELDS = new Set([...REQUIRED_FIELDS, ...OPTIONAL_FIELDS]);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[0-9+()\-\s]{7,}$/;

function assertAllowedFields(payload) {
  const disallowed = Object.keys(payload).filter((key) => !ALLOWED_FIELDS.has(key));

  if (disallowed.length > 0) {
    throw new ValidationError('Customer payload contains unsupported properties.', disallowed);
  }
}

function assertRequiredFields(payload) {
  const missing = REQUIRED_FIELDS.filter((field) => payload[field] === undefined || payload[field] === null || payload[field] === '');

  if (missing.length > 0) {
    throw new ValidationError('Customer payload is missing required fields.', missing);
  }
}

function assertFieldFormats(payload) {
  if (payload.email && !emailPattern.test(payload.email)) {
    throw new ValidationError('Customer email format is invalid.', { email: payload.email });
  }

  if (payload.phone && !phonePattern.test(payload.phone)) {
    throw new ValidationError('Customer phone format is invalid.', { phone: payload.phone });
  }
}

export function parseCustomerPayload(payload, { partial = false } = {}) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new ValidationError('Customer payload must be an object.');
  }

  const sanitized = Object.fromEntries(
    Object.entries(payload).filter(([key, value]) => ALLOWED_FIELDS.has(key) && value !== undefined)
  );

  assertAllowedFields(sanitized);

  if (!partial) {
    assertRequiredFields(sanitized);
  }

  assertFieldFormats(sanitized);

  return {
    name: sanitized.name ?? null,
    primaryAddress: sanitized.primaryAddress ?? null,
    email: sanitized.email ?? null,
    phone: sanitized.phone ?? null,
    planTier: sanitized.planTier ?? null
  };
}
