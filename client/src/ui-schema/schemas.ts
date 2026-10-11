import type { ComponentSchema } from './types';

const TONES = ['neutral', 'info', 'success', 'warning', 'danger', 'accent'] as const;
const GAPS = ['xs', 'sm', 'md', 'lg'] as const;

// Props shared by every form field. `name` is the key in the surrounding form's values.
const fieldProps = {
  name: { type: 'string', required: true },
  label: { type: 'string', required: true },
  help: { type: 'string' },
} as const;

/** What each registered component accepts when it is declared in JSON. */
export const schemas = {
  Stack: {
    description: 'Lays children out in a row or a column with even spacing.',
    children: 'nodes',
    props: {
      gap: { type: 'enum', values: GAPS, default: 'md' },
      direction: { type: 'enum', values: ['vertical', 'horizontal'], default: 'vertical' },
      align: { type: 'enum', values: ['start', 'center', 'end', 'stretch'], default: 'stretch' },
      justify: { type: 'enum', values: ['start', 'between', 'end'], default: 'start' },
    },
  },
  Grid: {
    description: 'Responsive grid; fits as many columns of at least `minItemWidth` pixels as there is room for.',
    children: 'nodes',
    props: {
      minItemWidth: { type: 'number', default: 240 },
      gap: { type: 'enum', values: GAPS, default: 'md' },
    },
  },
  Card: {
    description: 'Bordered surface with an optional heading.',
    children: 'nodes',
    props: {
      title: { type: 'string' },
      subtitle: { type: 'string' },
    },
  },
  Button: {
    description: 'Button that triggers an action.',
    children: 'none',
    props: {
      label: { type: 'string', required: true },
      variant: { type: 'enum', values: ['primary', 'secondary', 'ghost', 'danger'], default: 'primary' },
      size: { type: 'enum', values: ['sm', 'md'], default: 'md' },
      disabled: { type: 'boolean', default: false },
      onClick: { type: 'action' },
    },
  },
  StatTile: {
    description: 'A single headline number with a label, a hint and an optional badge.',
    children: 'none',
    props: {
      label: { type: 'string', required: true },
      value: { type: 'string', required: true },
      hint: { type: 'string' },
      badge: { type: 'string' },
      badgeTone: { type: 'enum', values: TONES, default: 'neutral' },
    },
  },
  ProgressBar: {
    description: 'Horizontal bar showing `value` as a share of `max`.',
    children: 'none',
    props: {
      label: { type: 'string' },
      value: { type: 'number', required: true },
      max: { type: 'number', default: 100 },
      valueLabel: { type: 'string' },
      tone: { type: 'enum', values: TONES, default: 'accent' },
    },
  },
  ListRow: {
    description: 'One line in a list: title, optional description, and a meta text or badge on the right.',
    children: 'none',
    props: {
      title: { type: 'string', required: true },
      description: { type: 'string' },
      meta: { type: 'string' },
      badge: { type: 'string' },
      badgeTone: { type: 'enum', values: TONES, default: 'neutral' },
      onClick: { type: 'action' },
    },
  },
  EmptyState: {
    description: 'Placeholder shown when there is nothing to list.',
    children: 'none',
    props: {
      title: { type: 'string', required: true },
      description: { type: 'string' },
      actionLabel: { type: 'string' },
      onAction: { type: 'action' },
    },
  },
  FormSection: {
    description: 'Titled group of form fields.',
    children: 'nodes',
    props: {
      title: { type: 'string', required: true },
      description: { type: 'string' },
    },
  },
  TextField: {
    description: 'Single- or multi-line text input bound to a form value.',
    children: 'none',
    props: {
      ...fieldProps,
      placeholder: { type: 'string' },
      inputType: { type: 'enum', values: ['text', 'date'], default: 'text' },
      multiline: { type: 'boolean', default: false },
    },
  },
  NumberField: {
    description: 'Whole-number input bound to a form value.',
    children: 'none',
    props: {
      ...fieldProps,
      min: { type: 'number' },
      max: { type: 'number' },
    },
  },
  SelectField: {
    description: 'Dropdown bound to a form value. `options` is a list of { value, label }.',
    children: 'none',
    props: {
      ...fieldProps,
      options: { type: 'array', required: true },
      placeholder: { type: 'string' },
    },
  },
  ToggleField: {
    description: 'On/off switch bound to a boolean form value.',
    children: 'none',
    props: { ...fieldProps },
  },
} satisfies Record<string, ComponentSchema>;

export type RegisteredType = keyof typeof schemas;
