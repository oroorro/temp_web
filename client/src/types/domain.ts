export type ProjectStatus = 'planning' | 'active' | 'paused' | 'done';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type ProjectSort = 'updated' | 'name' | 'due' | 'progress';
export type DateFormat = 'short' | 'medium' | 'relative';

export interface Member {
  id: string;
  name: string;
  role: string;
  color: string;
}

export type TaskCounts = Record<TaskStatus, number> & { total: number };

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  ownerId: string;
  memberIds: string[];
  tags: string[];
  /** Date only, `YYYY-MM-DD`. */
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  taskCounts: TaskCounts;
  /** Share of tasks that are done, 0–100. */
  progress: number;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string | null;
  estimate: number;
  createdAt: string;
  updatedAt: string;
}

/** A task as listed under its assignee by `GET /api/team`. */
export interface TeamTask {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimate: number;
  projectId: string;
  projectName: string;
  updatedAt: string;
}

export interface TeamMember extends Member {
  projects: Pick<Project, 'id' | 'name' | 'status'>[];
  tasks: TeamTask[];
}

export interface ActivityEntry {
  id: string;
  type: string;
  message: string;
  projectId: string | null;
  createdAt: string;
}

export interface DashboardSummary {
  totals: {
    projects: number;
    activeProjects: number;
    overdueProjects: number;
    tasks: number;
    openTasks: number;
    completedTasks: number;
    completionRate: number;
  };
  tasksByStatus: { status: TaskStatus; count: number }[];
  workload: { memberId: string; name: string; openTasks: number }[];
  upcoming: { id: string; name: string; status: ProjectStatus; dueDate: string; progress: number }[];
}

// Declared as a type alias (not an interface) so it can be used as form values.
export type WorkspaceSettings = {
  workspaceName: string;
  dateFormat: DateFormat;
  defaultProjectSort: ProjectSort;
  showCompletedTasks: boolean;
  /** Maximum tasks allowed in "In progress"; 0 turns the limit off. */
  wipLimit: number;
  activityFeedSize: number;
};

export interface NewProjectInput {
  name: string;
  description: string;
  status: ProjectStatus;
  ownerId: string;
  dueDate: string | null;
  tags: string[];
}

export type ProjectPatch = Partial<NewProjectInput>;

export interface NewTaskInput {
  title: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string | null;
  estimate?: number;
}

export type TaskPatch = Partial<Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'assigneeId' | 'estimate'>>;
