import { PROJECT_SORTS, PROJECT_STATUSES } from '../constants.js';
import * as projectsService from '../services/projects.service.js';
import { enumParam, stringParam } from '../utils/query.js';

export function list(req, res) {
  res.json(
    projectsService.listProjects({
      status: enumParam(req.query, 'status', PROJECT_STATUSES),
      sort: enumParam(req.query, 'sort', PROJECT_SORTS),
      q: stringParam(req.query, 'q'),
    }),
  );
}

export function get(req, res) {
  res.json(projectsService.getProject(req.params.projectId));
}

export function create(req, res) {
  res.status(201).json(projectsService.createProject(req.body));
}

export function update(req, res) {
  res.json(projectsService.updateProject(req.params.projectId, req.body));
}
