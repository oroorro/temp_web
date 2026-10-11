import { createContext } from 'react';
import type { FormErrors, FormValues } from '../../logic/formLogic';

/** The part of a form controller that individual fields need. */
export interface FormBinding {
  values: FormValues;
  errors: FormErrors;
  disabled: boolean;
  setValue: (name: string, value: unknown) => void;
  touch: (name: string) => void;
}

export const FormContext = createContext<FormBinding | null>(null);
