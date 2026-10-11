import { TEAM_LAYOUT_OPTIONS, TEAM_SORT_OPTIONS } from '../../logic/labels';
import type { Option, TeamView } from '../../types/ui';
import { Button } from '../common/Button';
import { SearchInput } from '../common/SearchInput';
import { SegmentedControl } from '../common/SegmentedControl';
import { SelectInput } from '../common/SelectInput';

interface TeamToolbarProps {
  view: TeamView;
  roleOptions: Option[];
  isFiltered: boolean;
  onChange: <K extends keyof TeamView>(name: K, value: TeamView[K]) => void;
  onReset: () => void;
}

export function TeamToolbar({ view, roleOptions, isFiltered, onChange, onReset }: TeamToolbarProps) {
  return (
    <div className="toolbar">
      <SearchInput value={view.search} label="Search members" onChange={(value) => onChange('search', value)} />
      <SelectInput label="Role" value={view.role} options={roleOptions} onChange={(value) => onChange('role', value)} />
      {isFiltered && <Button label="Clear filters" variant="ghost" size="sm" onClick={onReset} />}
      <div className="toolbar__end">
        <SelectInput
          label="Sort by"
          value={view.sort}
          options={TEAM_SORT_OPTIONS}
          onChange={(value) => onChange('sort', value)}
        />
        <SegmentedControl
          label="Layout"
          value={view.layout}
          options={TEAM_LAYOUT_OPTIONS}
          onChange={(value) => onChange('layout', value)}
        />
      </div>
    </div>
  );
}
