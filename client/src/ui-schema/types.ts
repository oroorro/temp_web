import type { ComponentType } from 'react';

// ---------------------------------------------------------------------------
// Declarations: what the JSON files contain
// ---------------------------------------------------------------------------

/** `{ "$bind": "totals.projects" }` is replaced by the value at that path in the scope. */
export interface BindingExpr {
  $bind: string;
}

/** `{ "$action": "navigate", "payload": "/projects" }` becomes a callback that runs the named action. */
export interface ActionExpr {
  $action: string;
  payload?: UIValue;
}

/** Any prop value. Strings may contain `{{path}}` placeholders. */
export type UIValue = string | number | boolean | null | BindingExpr | ActionExpr | UIValue[] | { [key: string]: UIValue };

export interface RepeatSpec {
  /** Scope path of the array to iterate. */
  source: string;
  /** Name under which each item is added to the scope. */
  as: string;
  /** Path (within the item scope) of a stable React key; defaults to the index. */
  key?: string;
  /** Rendered instead when the array is empty. */
  empty?: UINode;
}

export interface UINode {
  /** Name of a component in the registry. */
  type: string;
  id?: string;
  props?: Record<string, UIValue>;
  children?: UINode[];
  /** Scope path; the node is skipped while the value there is falsy. */
  when?: string;
  repeat?: RepeatSpec;
}

export interface UIDeclaration {
  id: string;
  version: number;
  root: UINode;
}

// ---------------------------------------------------------------------------
// Schemas: what each registered component accepts
// ---------------------------------------------------------------------------

export type PropType = 'string' | 'number' | 'boolean' | 'enum' | 'array' | 'action';

export interface PropSchema {
  type: PropType;
  required?: boolean;
  default?: string | number | boolean;
  /** Allowed values, for `enum` props. */
  values?: readonly string[];
}

export interface ComponentSchema {
  description: string;
  /** Whether the component renders nested nodes. */
  children: 'none' | 'nodes';
  props: Record<string, PropSchema>;
}

export interface RegistryEntry {
  // Props are checked against `schema` at runtime, so the component type is left open here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  schema: ComponentSchema;
}

export type Registry = Record<string, RegistryEntry>;

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

export type Scope = Record<string, unknown>;
export type ActionHandler = (payload: unknown) => void;
export type ActionMap = Record<string, ActionHandler>;

export interface RenderContext {
  scope: Scope;
  actions: ActionMap;
}

export interface SchemaProblem {
  /** Where in the declaration the problem is, e.g. `root.children[1](Card)`. */
  path: string;
  message: string;
}
