import { useCallback, useReducer } from 'react';
import { INITIAL_MUTATION_STATE, describeError, mutationReducer, resolveOption } from '../../logic/mutationLogic';
import { useResourceStore } from '../../store/resourceStore';
import { useLatest } from './useLatest';
import { useMountedRef } from './useMountedRef';
import { useToast } from './useToast';

type Derived<TValue, TResult, TInput> = TValue | ((result: TResult, input: TInput) => TValue);

export interface MutationOptions<TInput, TResult> {
  /** Runs before the request; return a function to undo an optimistic change if the request fails. */
  onMutate?: (input: TInput) => (() => void) | undefined;
  onSuccess?: (result: TResult, input: TInput) => void;
  /** Resource key prefixes to mark stale after a successful write. */
  invalidates?: Derived<string[], TResult, TInput>;
  successMessage?: Derived<string, TResult, TInput>;
  errorMessage?: string;
}

/**
 * Wraps a write call with pending/error state, toasts and cache invalidation.
 * `mutate` resolves to the result, or `undefined` when the call failed.
 */
export function useMutation<TInput, TResult>(
  mutationFn: (input: TInput) => Promise<TResult>,
  options: MutationOptions<TInput, TResult> = {},
) {
  const [state, dispatch] = useReducer(mutationReducer, INITIAL_MUTATION_STATE);
  const mounted = useMountedRef();
  const toast = useToast();
  const mutationRef = useLatest(mutationFn);
  const optionsRef = useLatest(options);

  const mutate = useCallback(
    async (input: TInput): Promise<TResult | undefined> => {
      const { onMutate, onSuccess, invalidates, successMessage, errorMessage } = optionsRef.current;
      dispatch({ type: 'start' });
      const rollback = onMutate?.(input);

      try {
        const result = await mutationRef.current(input);

        const stalePrefixes = resolveOption(invalidates, result, input);
        if (stalePrefixes) useResourceStore.getState().invalidate(stalePrefixes);
        if (mounted.current) dispatch({ type: 'success' });

        const message = resolveOption(successMessage, result, input);
        if (message) toast.success(message);
        onSuccess?.(result, input);
        return result;
      } catch (error) {
        rollback?.();
        const message = describeError(error, errorMessage);
        if (mounted.current) dispatch({ type: 'failure', message });
        toast.error(message);
        return undefined;
      }
    },
    [mounted, mutationRef, optionsRef, toast],
  );

  return { mutate, isPending: state.pending > 0, error: state.error };
}
