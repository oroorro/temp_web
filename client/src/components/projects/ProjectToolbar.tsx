import { PROJECT_SORT_OPTIONS, PROJECT_STATUS_OPTIONS } from '../../logic/labels';
import type { ProjectSort, ProjectStatus } from '../../types/domain';
import type { Option, ProjectFilters } from '../../types/ui';
import { Button } from '../common/Button';
import { SearchInput } from '../common/SearchInput';
import { SegmentedControl } from '../common/SegmentedControl';
import { SelectInput } from '../common/SelectInput';

interface ProjectToolbarProps {
  filters: ProjectFilters;
  /** The sort order in effect, which may be the workspace default. */
  sort: ProjectSort;
  isFiltered: boolean;
  onChange: <K extends keyof ProjectFilters>(name: K, value: ProjectFilters[K]) => void;
  onReset: () => void;
}

const STATUS_OPTIONS: Option<ProjectStatus | 'all'>[] = [{ value: 'all', label: 'All' }, ...PROJECT_STATUS_OPTIONS];

export function ProjectToolbar({ filters, sort, isFiltered, onChange, onReset }: ProjectToolbarProps) {
  return (
    <div className="toolbar">
      <SearchInput value={filters.search} label="Search projects" onChange={(value) => onChange('search', value)} />
      <SegmentedControl
        label="Status"
        value={filters.status}
        options={STATUS_OPTIONS}
        onChange={(value) => onChange('status', value)}
      />
      {isFiltered && <Button label="Clear filters" variant="ghost" size="sm" onClick={onReset} />}
      <div className="toolbar__end">
        <SelectInput
          label="Sort by"
          value={sort}
          options={PROJECT_SORT_OPTIONS}
          onChange={(value) => onChange('sort', value)}
        />
      </div>
    </div>
  );
}
