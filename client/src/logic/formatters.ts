import type { DateFormat } from '../types/domain';
import type { Tone } from '../types/ui';

const LOCALE = 'en';
const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export interface DueInfo {
  label: string;
  tone: Tone;
}

/** Date-only strings are read as local midnight, so "today" means the user's today. */
export function parseDate(value: string): Date {
  return new Date(value.length === 10 ? `${value}T00:00:00` : value);
}

export function pluralize(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export function formatRelative(value: string, now: number): string {
  const diff = parseDate(value).getTime() - now;
  const size = Math.abs(diff);
  if (size < MINUTE_MS) return 'just now';

  const relative = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' });
  if (size < HOUR_MS) return relative.format(Math.round(diff / MINUTE_MS), 'minute');
  if (size < DAY_MS) return relative.format(Math.round(diff / HOUR_MS), 'hour');
  if (size < 30 * DAY_MS) return relative.format(Math.round(diff / DAY_MS), 'day');
  return relative.format(Math.round(diff / (30 * DAY_MS)), 'month');
}

export function formatDate(value: string, format: DateFormat, now: number): string {
  if (format === 'relative') return formatRelative(value, now);
  return new Intl.DateTimeFormat(LOCALE, { dateStyle: format }).format(parseDate(value));
}

export function daysUntil(dateOnly: string, now: number): number {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return Math.round((parseDate(dateOnly).getTime() - today.getTime()) / DAY_MS);
}

/** Turns a due date into a short label plus a tone that reflects how urgent it is. */
export function describeDue(dueDate: string | null, format: DateFormat, now: number, isDone = false): DueInfo | null {
  if (!dueDate) return null;

  const days = daysUntil(dueDate, now);
  const dated = `Due ${formatDate(dueDate, format === 'relative' ? 'medium' : format, now)}`;

  if (isDone) return { label: dated, tone: 'neutral' };
  if (days < 0) return { label: `Overdue by ${pluralize(-days, 'day')}`, tone: 'danger' };
  if (days === 0) return { label: 'Due today', tone: 'warning' };
  if (days <= 7) return { label: `Due in ${pluralize(days, 'day')}`, tone: 'warning' };
  return { label: dated, tone: 'neutral' };
}

export function formatDocumentTitle(pageTitle: string, workspaceName: string): string {
  return `${pageTitle} · ${workspaceName}`;
}

/** Share of `value` in `max`, clamped to 0–1. */
export function toRatio(value: number, max: number): number {
  if (!Number.isFinite(value) || !Number.isFinite(max) || max <= 0) return 0;
  return Math.min(1, Math.max(0, value / max));
}
