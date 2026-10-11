const API_BASE: string = import.meta.env.VITE_API_BASE ?? '/api';

export type QueryParams = Record<string, string | number | boolean | null | undefined>;

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  query?: QueryParams;
  body?: unknown;
}

export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function buildUrl(path: string, query: QueryParams = {}): string {
  const params = new URLSearchParams();
  for (const [name, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') params.set(name, String(value));
  }
  const search = params.toString();
  return `${API_BASE}${path}${search ? `?${search}` : ''}`;
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** Pulls a readable message out of the server's `{ error: { message, details } }` shape. */
function extractMessage(payload: unknown): string | undefined {
  if (typeof payload !== 'object' || payload === null || !('error' in payload)) return undefined;
  const error = payload.error;
  if (typeof error !== 'object' || error === null || !('message' in error)) return undefined;

  const message = String(error.message);
  const details = 'details' in error ? error.details : undefined;
  const first: unknown = Array.isArray(details) ? details[0] : undefined;
  if (typeof first === 'object' && first !== null && 'message' in first) {
    return `${message}: ${String(first.message)}`;
  }
  return message;
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', query, body } = options;
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (cause) {
    throw new ApiError(0, 'Cannot reach the API server. Is it running?', cause);
  }

  const payload = await readBody(response);
  if (!response.ok) {
    throw new ApiError(response.status, extractMessage(payload) ?? `Request failed (${response.status})`, payload);
  }
  return payload as T;
}
