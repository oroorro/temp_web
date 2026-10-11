import type { TeamMember } from '../types/domain';
import { request } from './client';

export const fetchTeam = () => request<TeamMember[]>('/team');
