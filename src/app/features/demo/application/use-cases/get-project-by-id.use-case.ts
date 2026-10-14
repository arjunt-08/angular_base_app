import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectRepository } from '../../domain/repositories/project.repository';
import { Project } from '../../domain/models/project.model';
import { ProjectValidationDomainError } from '../../domain/errors/project.errors';

@Injectable({
  providedIn: 'root',
})
export class GetProjectByIdUseCase {
  private readonly projectRepo = inject(ProjectRepository);

  execute(id: string): Observable<Project> {
    if (!id || id.trim().length === 0) {
      throw new ProjectValidationDomainError('A valid project ID is required.');
    }
    return this.projectRepo.getById(id.trim());
  }
}
