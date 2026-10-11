import { useMemo } from 'react';
import { PRIORITY_META, TASK_PRIORITIES } from '../../logic/labels';
import type { Member, TaskPriority } from '../../types/domain';
import type { Option, TaskFilters } from '../../types/ui';
import { Button } from '../common/Button';
import { SearchInput } from '../common/SearchInput';
import { SegmentedControl } from '../common/SegmentedControl';
import { SelectInput } from '../common/SelectInput';

interface TaskFilterBarProps {
  filters: TaskFilters;
  team: Member[];
  /** e.g. "5 of 8 tasks". */
  countLabel: string;
  isFiltered: boolean;
  onChange: <K extends keyof TaskFilters>(name: K, value: TaskFilters[K]) => void;
  onReset: () => void;
}

const PRIORITY_OPTIONS: Option<TaskPriority | 'all'>[] = [
  { value: 'all', label: 'All' },
  ...TASK_PRIORITIES.map((priority) => ({ value: priority, label: PRIORITY_META[priority].label })),
];

export function TaskFilterBar({ filters, team, countLabel, isFiltered, onChange, onReset }: TaskFilterBarProps) {
  const assigneeOptions = useMemo<Option[]>(
    () => [
      { value: 'all', label: 'Everyone' },
      { value: 'unassigned', label: 'Unassigned' },
      ...team.map((member) => ({ value: member.id, label: member.name })),
    ],
    [team],
  );

  return (
    <div className="toolbar">
      <SearchInput value={filters.search} label="Search tasks" onChange={(value) => onChange('search', value)} />
      <SelectInput
        label="Assignee"
        value={filters.assigneeId}
        options={assigneeOptions}
        onChange={(value) => onChange('assigneeId', value)}
      />
      <SegmentedControl
        label="Priority"
        value={filters.priority}
        options={PRIORITY_OPTIONS}
        onChange={(value) => onChange('priority', value)}
      />
      {isFiltered && <Button label="Clear filters" variant="ghost" size="sm" onClick={onReset} />}
      <span className="toolbar__summary">{countLabel}</span>
    </div>
  );
}
