import * as settingsService from '../services/settings.service.js';

export function get(_req, res) {
  res.json(settingsService.getSettings());
}

export function update(req, res) {
  res.json(settingsService.updateSettings(req.body));
}
