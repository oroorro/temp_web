import { hasTemplate, isAction, isBinding } from './resolve';
import type { ComponentSchema, PropSchema, Registry, SchemaProblem, UIDeclaration, UINode } from './types';

/**
 * How deep nodes may nest inside one declaration. Together with the components
 * around the renderer this keeps the rendered tree within the app's depth budget.
 */
export const MAX_SCHEMA_DEPTH = 6;

interface Checked {
  value?: unknown;
  problem?: string;
}

/** Checks one resolved value against its prop schema, coercing where that is harmless. */
function checkValue(value: unknown, schema: PropSchema): Checked {
  switch (schema.type) {
    case 'string':
      if (typeof value === 'string') return { value };
      if (typeof value === 'number') return { value: String(value) };
      return { problem: 'must be text' };
    case 'number':
      return typeof value === 'number' && Number.isFinite(value) ? { value } : { problem: 'must be a number' };
    case 'boolean':
      return typeof value === 'boolean' ? { value } : { problem: 'must be true or false' };
    case 'enum':
      return typeof value === 'string' && (schema.values ?? []).includes(value)
        ? { value }
        : { problem: `must be one of: ${(schema.values ?? []).join(', ')}` };
    case 'array':
      return Array.isArray(value) ? { value } : { problem: 'must be a list' };
    case 'action':
      return typeof value === 'function' ? { value } : { problem: 'must be an action' };
  }
}

/**
 * Runtime step: validates resolved props, fills in defaults and drops anything
 * the schema does not know about.
 */
export function applySchema(
  resolved: Record<string, unknown>,
  schema: ComponentSchema,
): { props: Record<string, unknown>; problems: string[] } {
  const props: Record<string, unknown> = {};
  const problems: string[] = [];

  for (const [name, propSchema] of Object.entries(schema.props)) {
    const raw = resolved[name] ?? propSchema.default;
    if (raw === undefined || raw === null) {
      if (propSchema.required) problems.push(`"${name}" is required`);
      continue;
    }
    const { value, problem } = checkValue(raw, propSchema);
    if (problem) problems.push(`"${name}" ${problem}`);
    else props[name] = value;
  }

  return { props, problems };
}

/** Static check of a literal prop; bindings and templates can only be judged at runtime. */
function checkDeclaredProp(value: unknown, schema: PropSchema): string | undefined {
  if (isBinding(value) || hasTemplate(value)) return undefined;
  if (schema.type === 'action') return isAction(value) ? undefined : 'must be an { "$action": … } object';
  if (isAction(value)) return 'cannot be an action';
  return checkValue(value, schema).problem;
}

function validateNode(node: UINode, path: string, depth: number, registry: Registry, problems: SchemaProblem[]) {
  const here = `${path}(${node.type})`;
  const report = (message: string) => problems.push({ path: here, message });

  if (depth > MAX_SCHEMA_DEPTH) report(`is nested deeper than ${MAX_SCHEMA_DEPTH} levels`);

  const entry = registry[node.type];
  if (!entry) {
    report('is not a registered component');
    return;
  }

  const declared = node.props ?? {};
  for (const name of Object.keys(declared)) {
    const propSchema = entry.schema.props[name];
    if (!propSchema) {
      report(`has an unknown prop "${name}"`);
      continue;
    }
    const problem = checkDeclaredProp(declared[name], propSchema);
    if (problem) report(`prop "${name}" ${problem}`);
  }
  for (const [name, propSchema] of Object.entries(entry.schema.props)) {
    if (propSchema.required && propSchema.default === undefined && !(name in declared)) {
      report(`is missing the required prop "${name}"`);
    }
  }

  if (node.repeat) {
    if (!node.repeat.source || !node.repeat.as) report('has a repeat without "source" and "as"');
    if (node.repeat.empty) validateNode(node.repeat.empty, `${here}.repeat.empty`, depth, registry, problems);
  }

  const children = node.children ?? [];
  if (children.length > 0 && entry.schema.children === 'none') report('does not accept children');
  children.forEach((child, index) =>
    validateNode(child, `${here}.children[${index}]`, depth + 1, registry, problems),
  );
}

/** Walks a whole declaration and lists everything that does not match the registry's schemas. */
export function validateDeclaration(declaration: UIDeclaration, registry: Registry): SchemaProblem[] {
  const problems: SchemaProblem[] = [];
  validateNode(declaration.root, 'root', 1, registry, problems);
  return problems;
}
