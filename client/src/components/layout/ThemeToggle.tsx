import { useTheme } from '../../hooks/core/useTheme';
import { THEME_LABELS } from '../../logic/themeLogic';
import type { ThemePreference } from '../../logic/themeLogic';
import type { IconName } from '../../types/ui';
import { IconButton } from '../common/IconButton';

const THEME_ICONS: Record<ThemePreference, IconName> = {
  system: 'monitor',
  light: 'sun',
  dark: 'moon',
};

/** Cycles system → light → dark. */
export function ThemeToggle() {
  const { preference, cycle } = useTheme();
  return <IconButton icon={THEME_ICONS[preference]} label={`${THEME_LABELS[preference]} (click to change)`} onClick={cycle} />;
}
