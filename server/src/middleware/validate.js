import { badRequest } from '../utils/httpError.js';

/**
 * Rule shape:
 *   { type: 'string' | 'number' | 'boolean' | 'stringArray',
 *     required?, nullable?, enum?, pattern?, maxLength?, min?, max?, integer? }
 */
function checkValue(field, value, rule) {
  switch (rule.type) {
    case 'string': {
      if (typeof value !== 'string') return `${field} must be a string`;
      const trimmed = value.trim();
      if (rule.required && trimmed === '') return `${field} is required`;
      if (rule.maxLength && trimmed.length > rule.maxLength) {
        return `${field} must be at most ${rule.maxLength} characters`;
      }
      if (rule.enum && !rule.enum.includes(trimmed)) {
        return `${field} must be one of: ${rule.enum.join(', ')}`;
      }
      if (rule.pattern && !rule.pattern.test(trimmed)) return `${field} has an invalid format`;
      return null;
    }
    case 'number': {
      if (typeof value !== 'number' || !Number.isFinite(value)) return `${field} must be a number`;
      if (rule.integer && !Number.isInteger(value)) return `${field} must be a whole number`;
      if (rule.min !== undefined && value < rule.min) return `${field} must be at least ${rule.min}`;
      if (rule.max !== undefined && value > rule.max) return `${field} must be at most ${rule.max}`;
      return null;
    }
    case 'boolean':
      return typeof value === 'boolean' ? null : `${field} must be true or false`;
    case 'stringArray':
      return Array.isArray(value) && value.every((item) => typeof item === 'string')
        ? null
        : `${field} must be a list of strings`;
    default:
      return `${field} has an unsupported rule type`;
  }
}

function normalise(value, rule) {
  if (rule.type === 'string') return value.trim();
  if (rule.type === 'stringArray') return value.map((item) => item.trim()).filter(Boolean);
  return value;
}

/**
 * Validates req.body against `rules` and replaces it with the cleaned value
 * (unknown fields are dropped). With `partial`, missing fields are allowed.
 */
export function validateBody(rules, { partial = false } = {}) {
  return (req, _res, next) => {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const value = {};
    const errors = [];

    for (const [field, rule] of Object.entries(rules)) {
      const raw = body[field];

      if (raw === undefined) {
        if (rule.required && !partial) errors.push({ field, message: `${field} is required` });
        continue;
      }
      if (raw === null) {
        if (rule.nullable) value[field] = null;
        else errors.push({ field, message: `${field} cannot be null` });
        continue;
      }

      const message = checkValue(field, raw, rule);
      if (message) errors.push({ field, message });
      else value[field] = normalise(raw, rule);
    }

    if (errors.length > 0) {
      next(badRequest('Validation failed', errors));
      return;
    }
    if (partial && Object.keys(value).length === 0) {
      next(badRequest('Request body has no updatable fields'));
      return;
    }

    req.body = value;
    next();
  };
}
