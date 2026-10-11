/** Joins the truthy class names: `cx('a', isOn && 'b')`. */
export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}
