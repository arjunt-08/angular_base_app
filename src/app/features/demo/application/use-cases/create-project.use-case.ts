import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectRepository } from '../../domain/repositories/project.repository';
import { CreateProjectPayload, Project } from '../../domain/models/project.model';
import { ProjectValidationDomainError } from '../../domain/errors/project.errors';

@Injectable({
  providedIn: 'root',
})
export class CreateProjectUseCase {
  private readonly projectRepo = inject(ProjectRepository);

  execute(payload: CreateProjectPayload): Observable<Project> {
    if (!payload.name || payload.name.trim().length === 0) {
      throw new ProjectValidationDomainError('Project name cannot be empty.');
    }
    if (!payload.code || payload.code.trim().length === 0) {
      throw new ProjectValidationDomainError('Project code cannot be empty.');
    }
    if (payload.budget <= 0) {
      throw new ProjectValidationDomainError('Project budget must be greater than zero.');
    }

    const sanitized: CreateProjectPayload = {
      ...payload,
      name: payload.name.trim(),
      code: payload.code.trim().toUpperCase(),
      description: payload.description.trim(),
      leadName: payload.leadName.trim(),
    };

    return this.projectRepo.create(sanitized);
  }
}
