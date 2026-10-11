import * as tasksService from '../services/tasks.service.js';

export function listForProject(req, res) {
  res.json(tasksService.listTasks(req.params.projectId));
}

export function create(req, res) {
  res.status(201).json(tasksService.createTask(req.params.projectId, req.body));
}

export function update(req, res) {
  res.json(tasksService.updateTask(req.params.taskId, req.body));
}

export function remove(req, res) {
  tasksService.deleteTask(req.params.taskId);
  res.status(204).end();
}
