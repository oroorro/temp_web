import { useCallback, useMemo, useReducer } from 'react';
import { createFormState, formReducer, hasErrors, isDirty, visibleErrors } from '../../logic/formLogic';
import type { FormErrors, FormValues, Validator } from '../../logic/formLogic';

export interface FormController<T extends FormValues> {
  values: T;
  /** Every current validation error. */
  errors: FormErrors;
  /** The errors that should be shown to the user right now. */
  visibleErrors: FormErrors;
  isDirty: boolean;
  isValid: boolean;
  setValue: (name: string, value: unknown) => void;
  touch: (name: string) => void;
  /** Back to the initial values, or to `values` as the new baseline. */
  reset: (values?: T) => void;
  /** Reveals all errors and returns the values when they are valid, otherwise `null`. */
  submit: () => T | null;
}

/** `validate` should be a stable function (module level or memoised). */
export function useFormState<T extends FormValues>(initial: T, validate: Validator<T>): FormController<T> {
  const [state, dispatch] = useReducer(formReducer<T>, initial, createFormState<T>);

  const errors = useMemo(() => validate(state.values), [validate, state.values]);
  const shownErrors = useMemo(() => visibleErrors(errors, state), [errors, state]);

  const setValue = useCallback((name: string, value: unknown) => dispatch({ type: 'set', name, value }), []);
  const touch = useCallback((name: string) => dispatch({ type: 'touch', name }), []);
  const reset = useCallback((values?: T) => dispatch({ type: 'reset', values }), []);
  const submit = useCallback(() => {
    dispatch({ type: 'submit' });
    return hasErrors(errors) ? null : state.values;
  }, [errors, state.values]);

  return {
    values: state.values,
    errors,
    visibleErrors: shownErrors,
    isDirty: isDirty(state),
    isValid: !hasErrors(errors),
    setValue,
    touch,
    reset,
    submit,
  };
}
