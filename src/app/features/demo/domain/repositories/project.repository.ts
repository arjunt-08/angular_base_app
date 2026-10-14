import { Observable } from 'rxjs';
import { Project, CreateProjectPayload, UpdateProjectPayload } from '../models/project.model';
import { ProjectFilterCriteria } from '../models/project-filter.model';
import { PaginatedResult } from '@shared/types/pagination.model';

export abstract class ProjectRepository {
  abstract list(criteria: ProjectFilterCriteria): Observable<PaginatedResult<Project>>;
  abstract getById(id: string): Observable<Project>;
  abstract create(payload: CreateProjectPayload): Observable<Project>;
  abstract update(id: string, payload: UpdateProjectPayload): Observable<Project>;
  abstract delete(id: string): Observable<void>;
}
