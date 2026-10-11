import type { ActionExpr, BindingExpr, RenderContext, Scope, UIValue } from './types';

const TEMPLATE = /\{\{\s*([\w.]+)\s*\}\}/g;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isBinding(value: unknown): value is BindingExpr {
  return isObject(value) && typeof value.$bind === 'string';
}

export function isAction(value: unknown): value is ActionExpr {
  return isObject(value) && typeof value.$action === 'string';
}

export function hasTemplate(value: unknown): value is string {
  return typeof value === 'string' && value.includes('{{');
}

/** Reads a dotted path such as `totals.openTasks` out of the scope. */
export function getPath(scope: Scope, path: string): unknown {
  let current: unknown = scope;
  for (const segment of path.split('.')) {
    if (typeof current !== 'object' || current === null) return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
}

export function interpolate(template: string, scope: Scope): string {
  return template.replace(TEMPLATE, (_match, path: string) => {
    const value = getPath(scope, path);
    return value === undefined || value === null ? '' : String(value);
  });
}

/** Replaces bindings, templates and actions in a declared value with real values. */
export function resolveValue(value: UIValue, context: RenderContext): unknown {
  if (typeof value === 'string') return hasTemplate(value) ? interpolate(value, context.scope) : value;
  if (typeof value !== 'object' || value === null) return value;
  if (Array.isArray(value)) return value.map((item) => resolveValue(item, context));
  if (isBinding(value)) return getPath(context.scope, value.$bind);

  if (isAction(value)) {
    const { $action: name, payload } = value;
    const resolvedPayload = payload === undefined ? undefined : resolveValue(payload, context);
    return () => {
      const handler = context.actions[name];
      if (handler) handler(resolvedPayload);
      else console.warn(`[ui-schema] No handler registered for action "${name}"`);
    };
  }

  return resolveProps(value, context);
}

export function resolveProps(props: Record<string, UIValue>, context: RenderContext): Record<string, unknown> {
  return Object.fromEntries(Object.entries(props).map(([name, value]) => [name, resolveValue(value, context)]));
}
