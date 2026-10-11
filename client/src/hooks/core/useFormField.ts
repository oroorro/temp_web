import { useCallback, useId } from 'react';
import { useFormContext } from './useFormContext';

/** Everything one field needs: its current value and error, plus change and blur handlers. */
export function useFormField(name: string) {
  const { values, errors, disabled, setValue, touch } = useFormContext();
  const id = useId();

  const onChange = useCallback((value: unknown) => setValue(name, value), [name, setValue]);
  const onBlur = useCallback(() => touch(name), [name, touch]);

  return { id, value: values[name], error: errors[name] as string | undefined, disabled, onChange, onBlur };
}
