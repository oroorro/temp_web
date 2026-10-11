import { useContext } from 'react';
import { FormContext } from '../../components/form/FormContext';
import type { FormBinding } from '../../components/form/FormContext';

export function useFormContext(): FormBinding {
  const binding = useContext(FormContext);
  if (!binding) throw new Error('Form fields must be rendered inside a <FormProvider>.');
  return binding;
}
