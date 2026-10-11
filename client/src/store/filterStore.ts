import { create } from 'zustand';
import type { ProjectFilters, TaskFilters } from '../types/ui';

interface FilterState {
  projects: ProjectFilters;
  tasks: TaskFilters;
  setProjectFilter: <K extends keyof ProjectFilters>(name: K, value: ProjectFilters[K]) => void;
  resetProjectFilters: () => void;
  setTaskFilter: <K extends keyof TaskFilters>(name: K, value: TaskFilters[K]) => void;
  resetTaskFilters: () => void;
}

const DEFAULT_PROJECT_FILTERS: ProjectFilters = { search: '', status: 'all', sort: null };
const DEFAULT_TASK_FILTERS: TaskFilters = { search: '', assigneeId: 'all', priority: 'all' };

/** List and board filters live here so they survive navigating between pages. */
export const useFilterStore = create<FilterState>()((set) => ({
  projects: DEFAULT_PROJECT_FILTERS,
  tasks: DEFAULT_TASK_FILTERS,
  setProjectFilter: (name, value) => set((state) => ({ projects: { ...state.projects, [name]: value } })),
  // Resetting clears what narrows the list but keeps the chosen sort order.
  resetProjectFilters: () => set((state) => ({ projects: { ...DEFAULT_PROJECT_FILTERS, sort: state.projects.sort } })),
  setTaskFilter: (name, value) => set((state) => ({ tasks: { ...state.tasks, [name]: value } })),
  resetTaskFilters: () => set({ tasks: DEFAULT_TASK_FILTERS }),
}));
