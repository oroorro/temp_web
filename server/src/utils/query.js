import { badRequest } from './httpError.js';

/** Reads an optional query param that must be one of `allowed`. */
export function enumParam(query, name, allowed) {
  const value = query[name];
  if (value === undefined || value === '') return undefined;
  if (typeof value !== 'string' || !allowed.includes(value)) {
    throw badRequest(`${name} must be one of: ${allowed.join(', ')}`);
  }
  return value;
}

export function stringParam(query, name) {
  const value = query[name];
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;
}

/** Reads an optional integer query param, clamped to [min, max]. */
export function intParam(query, name, { fallback, min, max }) {
  const value = query[name];
  if (value === undefined || value === '') return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) throw badRequest(`${name} must be an integer`);
  return Math.min(max, Math.max(min, parsed));
}
