import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectRepository } from '../../domain/repositories/project.repository';
import { ProjectFilterCriteria } from '../../domain/models/project-filter.model';
import { Project } from '../../domain/models/project.model';
import { PaginatedResult } from '@shared/types/pagination.model';

@Injectable({
  providedIn: 'root',
})
export class GetProjectsUseCase {
  private readonly projectRepo = inject(ProjectRepository);

  execute(criteria: ProjectFilterCriteria): Observable<PaginatedResult<Project>> {
    // Sanitize and ensure positive bounds
    const sanitized: ProjectFilterCriteria = {
      ...criteria,
      page: Math.max(1, criteria.page || 1),
      pageSize: Math.max(1, Math.min(100, criteria.pageSize || 10)),
      search: criteria.search?.trim(),
    };

    return this.projectRepo.list(sanitized);
  }
}
