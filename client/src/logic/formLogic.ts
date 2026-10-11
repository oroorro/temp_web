export type FormValues = Record<string, unknown>;
export type FormErrors = Record<string, string>;
export type Validator<T extends FormValues> = (values: T) => FormErrors;

export interface FormState<T extends FormValues> {
  initial: T;
  values: T;
  touched: Record<string, boolean>;
  submitted: boolean;
}

export type FormAction<T extends FormValues> =
  | { type: 'set'; name: string; value: unknown }
  | { type: 'touch'; name: string }
  | { type: 'submit' }
  | { type: 'reset'; values?: T };

export function createFormState<T extends FormValues>(initial: T): FormState<T> {
  return { initial, values: initial, touched: {}, submitted: false };
}

export function formReducer<T extends FormValues>(state: FormState<T>, action: FormAction<T>): FormState<T> {
  switch (action.type) {
    case 'set':
      return { ...state, values: { ...state.values, [action.name]: action.value } };
    case 'touch':
      return state.touched[action.name] ? state : { ...state, touched: { ...state.touched, [action.name]: true } };
    case 'submit':
      return state.submitted ? state : { ...state, submitted: true };
    case 'reset':
      return createFormState(action.values ?? state.initial);
  }
}

export function isDirty<T extends FormValues>(state: FormState<T>): boolean {
  return Object.keys(state.values).some((name) => !Object.is(state.values[name], state.initial[name]));
}

export function hasErrors(errors: FormErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Errors stay hidden until the field was visited or a submit was attempted. */
export function visibleErrors<T extends FormValues>(errors: FormErrors, state: FormState<T>): FormErrors {
  if (state.submitted) return errors;
  return Object.fromEntries(Object.entries(errors).filter(([name]) => state.touched[name]));
}

// Helpers for moving loosely typed form values in and out of native inputs.

export function asText(value: unknown): string {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : '';
}

/** An empty or unparsable number input is stored as `null` so validation can flag it. */
export function parseNumberInput(raw: string): number | null {
  if (raw.trim() === '') return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isWholeNumberBetween(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= min && value <= max;
}
