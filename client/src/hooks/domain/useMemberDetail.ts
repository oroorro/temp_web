import { useMemo, useState } from 'react';
import { tasksInTab, toTaskTabOptions } from '../../logic/teamLogic';
import type { TaskTab, TeamRow } from '../../logic/teamLogic';

/** Task tabs of the member detail panel. The tab is panel state, so a freshly mounted panel starts on "Open". */
export function useMemberDetail(row: TeamRow) {
  const [tab, setTab] = useState<TaskTab>('open');
  const tabOptions = useMemo(() => toTaskTabOptions(row), [row]);
  const tasks = useMemo(() => tasksInTab(row.member.tasks, tab), [row.member.tasks, tab]);

  return { tab, setTab, tabOptions, tasks };
}
