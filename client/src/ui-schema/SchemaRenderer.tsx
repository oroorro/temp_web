import { useMemo } from 'react';
import { renderNode } from './renderNode';
import type { ActionMap, Scope, UIDeclaration } from './types';

interface SchemaRendererProps {
  declaration: UIDeclaration;
  /** Data that `$bind` paths and `{{templates}}` in the declaration read from. */
  scope?: Scope;
  /** Handlers that `$action` entries in the declaration can call. */
  actions?: ActionMap;
}

const NO_SCOPE: Scope = {};
const NO_ACTIONS: ActionMap = {};

/** Renders a JSON UI declaration using the components in the registry. */
export function SchemaRenderer({ declaration, scope = NO_SCOPE, actions = NO_ACTIONS }: SchemaRendererProps) {
  const tree = useMemo(
    () => renderNode(declaration.root, { scope, actions }, 1, declaration.id),
    [declaration, scope, actions],
  );
  return <>{tree}</>;
}
