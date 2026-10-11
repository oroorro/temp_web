import { useCallback, useEffect } from 'react';
import { applyTheme, nextThemePreference, resolveTheme } from '../../logic/themeLogic';
import { useUiStore } from '../../store/uiStore';
import { useMediaQuery } from './useMediaQuery';

/** Keeps `<html data-theme>` in sync with the stored preference and the OS setting. */
export function useTheme() {
  const preference = useUiStore((state) => state.theme);
  const setTheme = useUiStore((state) => state.setTheme);
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const resolved = resolveTheme(preference, systemPrefersDark);

  useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);

  const cycle = useCallback(() => setTheme(nextThemePreference(preference)), [preference, setTheme]);

  return { preference, resolved, cycle };
}
