import { ProjectStatus } from './project.model';

export interface ProjectFilterCriteria {
  search?: string;
  status?: ProjectStatus | 'all';
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
