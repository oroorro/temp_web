import { useMemo } from 'react';
import type { ReactNode } from 'react';
import type { FormController } from '../../hooks/core/useFormState';
import type { FormValues } from '../../logic/formLogic';
import { FormContext } from './FormContext';
import type { FormBinding } from './FormContext';

interface FormProviderProps<T extends FormValues> {
  form: FormController<T>;
  disabled?: boolean;
  children: ReactNode;
}

/** Connects the field components below it (declared in JSX or JSON) to a form controller. */
export function FormProvider<T extends FormValues>({ form, disabled = false, children }: FormProviderProps<T>) {
  const { values, visibleErrors, setValue, touch } = form;
  const binding = useMemo<FormBinding>(
    () => ({ values, errors: visibleErrors, disabled, setValue, touch }),
    [values, visibleErrors, disabled, setValue, touch],
  );

  return <FormContext.Provider value={binding}>{children}</FormContext.Provider>;
}
