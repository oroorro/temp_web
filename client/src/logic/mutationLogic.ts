export interface MutationState {
  /** Number of calls in flight; the same mutation can run several times at once. */
  pending: number;
  error: string | null;
}

export type MutationAction = { type: 'start' } | { type: 'success' } | { type: 'failure'; message: string };

export const INITIAL_MUTATION_STATE: MutationState = { pending: 0, error: null };

export function mutationReducer(state: MutationState, action: MutationAction): MutationState {
  switch (action.type) {
    case 'start':
      return { pending: state.pending + 1, error: null };
    case 'success':
      return { ...state, pending: Math.max(0, state.pending - 1) };
    case 'failure':
      return { pending: Math.max(0, state.pending - 1), error: action.message };
  }
}

export function describeError(error: unknown, fallback = 'Something went wrong'): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

/** Options accept either a fixed value or a function of the mutation's result and input. */
export function resolveOption<TValue, TResult, TInput>(
  option: TValue | ((result: TResult, input: TInput) => TValue) | undefined,
  result: TResult,
  input: TInput,
): TValue | undefined {
  return typeof option === 'function'
    ? (option as (result: TResult, input: TInput) => TValue)(result, input)
    : option;
}
