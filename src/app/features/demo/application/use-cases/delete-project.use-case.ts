import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ProjectRepository } from '../../domain/repositories/project.repository';
import { ProjectValidationDomainError } from '../../domain/errors/project.errors';

@Injectable({
  providedIn: 'root',
})
export class DeleteProjectUseCase {
  private readonly projectRepo = inject(ProjectRepository);

  execute(id: string): Observable<void> {
    if (!id || id.trim().length === 0) {
      throw new ProjectValidationDomainError('A valid project ID is required for deletion.');
    }
    return this.projectRepo.delete(id.trim());
  }
}
