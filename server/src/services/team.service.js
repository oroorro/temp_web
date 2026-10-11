import { db } from '../data/db.js';

/** Every member together with the projects they belong to and the tasks assigned to them. */
export function getTeam() {
  const projectNames = new Map(db.projects.map((project) => [project.id, project.name]));

  return db.members.map((member) => ({
    ...member,
    projects: db.projects
      .filter((project) => project.memberIds.includes(member.id))
      .map(({ id, name, status }) => ({ id, name, status })),
    tasks: db.tasks
      .filter((task) => task.assigneeId === member.id)
      .map(({ id, title, status, priority, estimate, projectId, updatedAt }) => ({
        id,
        title,
        status,
        priority,
        estimate,
        projectId,
        projectName: projectNames.get(projectId) ?? '',
        updatedAt,
      })),
  }));
}
