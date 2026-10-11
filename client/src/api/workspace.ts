import type { ActivityEntry, DashboardSummary, Member, WorkspaceSettings } from '../types/domain';
import { request } from './client';

export const fetchMembers = () => request<Member[]>('/members');

export const fetchDashboardSummary = () => request<DashboardSummary>('/dashboard/summary');

export const fetchActivity = (limit: number) => request<ActivityEntry[]>('/dashboard/activity', { query: { limit } });

export const fetchSettings = () => request<WorkspaceSettings>('/settings');

export const updateSettings = (settings: WorkspaceSettings) =>
  request<WorkspaceSettings>('/settings', { method: 'PUT', body: settings });
