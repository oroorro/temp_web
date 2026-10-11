import type { ComponentType } from 'react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { Grid } from '../components/common/Grid';
import { ListRow } from '../components/common/ListRow';
import { ProgressBar } from '../components/common/ProgressBar';
import { Stack } from '../components/common/Stack';
import { StatTile } from '../components/common/StatTile';
import { FormSection } from '../components/form/FormSection';
import { NumberField } from '../components/form/NumberField';
import { SelectField } from '../components/form/SelectField';
import { TextField } from '../components/form/TextField';
import { ToggleField } from '../components/form/ToggleField';
import { schemas } from './schemas';
import type { RegisteredType } from './schemas';
import type { Registry } from './types';

// One component per schema; the mapped type makes a missing or extra entry a compile error.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const components: Record<RegisteredType, ComponentType<any>> = {
  Stack,
  Grid,
  Card,
  Button,
  StatTile,
  ProgressBar,
  ListRow,
  EmptyState,
  FormSection,
  TextField,
  NumberField,
  SelectField,
  ToggleField,
};

/** Maps the `type` used in JSON declarations to a component and the schema of its props. */
export const registry: Registry = Object.fromEntries(
  (Object.keys(schemas) as RegisteredType[]).map((type) => [
    type,
    { component: components[type], schema: schemas[type] },
  ]),
);
