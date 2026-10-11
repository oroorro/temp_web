import { createElement } from 'react';
import type { ReactNode } from 'react';
import { SchemaIssue } from './SchemaIssue';
import { registry } from './registry';
import { getPath, resolveProps } from './resolve';
import type { RenderContext, UINode } from './types';
import { MAX_SCHEMA_DEPTH, applySchema } from './validate';

function renderIssue(key: string, type: string, problems: string[]): ReactNode {
  return createElement(SchemaIssue, { key, type, problems });
}

/** Renders the node once per item of `repeat.source`, with the item added to the scope. */
function renderRepeat(node: UINode, context: RenderContext, depth: number, key: string): ReactNode {
  const { source, as, key: keyPath, empty } = node.repeat!;
  const items = getPath(context.scope, source);
  if (!Array.isArray(items)) return renderIssue(key, node.type, [`repeat source "${source}" is not a list`]);
  if (items.length === 0) return empty ? renderNode(empty, context, depth, `${key}:empty`) : null;

  const template: UINode = { ...node, repeat: undefined };
  return items.map((item: unknown, index) => {
    const scope = { ...context.scope, [as]: item, [`${as}Index`]: index };
    const itemKey = keyPath ? String(getPath(scope, keyPath)) : String(index);
    return renderNode(template, { ...context, scope }, depth, `${key}:${itemKey}`);
  });
}

/**
 * Turns one declared node into a React element:
 * registry lookup → resolve bindings → validate against the schema → render children.
 * Anything that does not check out renders a visible `SchemaIssue` instead of crashing the page.
 */
export function renderNode(node: UINode, context: RenderContext, depth: number, key: string): ReactNode {
  if (depth > MAX_SCHEMA_DEPTH) {
    return renderIssue(key, node.type, [`is nested deeper than ${MAX_SCHEMA_DEPTH} levels`]);
  }
  if (node.repeat) return renderRepeat(node, context, depth, key);
  if (node.when !== undefined && !getPath(context.scope, node.when)) return null;

  const entry = registry[node.type];
  if (!entry) return renderIssue(key, node.type, ['is not a registered component']);

  const { props, problems } = applySchema(resolveProps(node.props ?? {}, context), entry.schema);
  if (problems.length > 0) return renderIssue(key, node.type, problems);

  const children =
    entry.schema.children === 'nodes'
      ? (node.children ?? []).map((child, index) =>
          renderNode(child, context, depth + 1, child.id ?? `${child.type}-${index}`),
        )
      : [];

  return createElement(entry.component, { key, ...props }, ...children);
}
