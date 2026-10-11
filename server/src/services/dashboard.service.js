import { TASK_STATUSES } from '../constants.js';
import { db } from '../data/db.js';
import { withStats } from './projects.service.js';

const UPCOMING_LIMIT = 5;

export function getSummary() {
  const today = new Date().toISOString().slice(0, 10);
  const projects = db.projects.map(withStats);
  const openProjects = projects.filter((project) => project.status !== 'done');
  const completedTasks = db.tasks.filter((task) => task.status === 'done').length;

  const tasksByStatus = TASK_STATUSES.map((status) => ({
    status,
    count: db.tasks.filter((task) => task.status === status).length,
  }));

  const workload = db.members
    .map((member) => ({
      memberId: member.id,
      name: member.name,
      openTasks: db.tasks.filter((task) => task.assigneeId === member.id && task.status !== 'done').length,
    }))
    .sort((a, b) => b.openTasks - a.openTasks);

  const upcoming = openProjects
    .filter((project) => project.dueDate !== null)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, UPCOMING_LIMIT)
    .map(({ id, name, status, dueDate, progress }) => ({ id, name, status, dueDate, progress }));

  return {
    totals: {
      projects: projects.length,
      activeProjects: projects.filter((project) => project.status === 'active').length,
      overdueProjects: openProjects.filter((project) => project.dueDate !== null && project.dueDate < today).length,
      tasks: db.tasks.length,
      openTasks: db.tasks.length - completedTasks,
      completedTasks,
      completionRate: db.tasks.length === 0 ? 0 : Math.round((completedTasks / db.tasks.length) * 100),
    },
    tasksByStatus,
    workload,
    upcoming,
  };
}
