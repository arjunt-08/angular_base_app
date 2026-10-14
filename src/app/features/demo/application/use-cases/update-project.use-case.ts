import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectRepository } from '../../domain/repositories/project.repository';
import { UpdateProjectPayload, Project } from '../../domain/models/project.model';
import { ProjectValidationDomainError } from '../../domain/errors/project.errors';

@Injectable({
  providedIn: 'root',
})
export class UpdateProjectUseCase {
  private readonly projectRepo = inject(ProjectRepository);

  execute(id: string, payload: UpdateProjectPayload): Observable<Project> {
    if (!id || id.trim().length === 0) {
      throw new ProjectValidationDomainError('A valid project ID is required for update.');
    }
    if (payload.budget !== undefined && payload.budget <= 0) {
      throw new ProjectValidationDomainError('Updated budget must be positive.');
    }

    return this.projectRepo.update(id.trim(), payload);
  }
}
