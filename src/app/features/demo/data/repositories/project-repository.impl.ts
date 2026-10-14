import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ProjectRepository } from '../../domain/repositories/project.repository';
import {
  IProjectDatasource,
  PROJECT_DATASOURCE,
} from '../datasources/project-datasource.interface';
import { ProjectMapper } from '../mappers/project.mapper';
import {
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
} from '../../domain/models/project.model';
import { ProjectFilterCriteria } from '../../domain/models/project-filter.model';
import { PaginatedResult } from '@shared/types/pagination.model';

@Injectable()
export class ProjectRepositoryImpl implements ProjectRepository {
  private readonly datasource = inject<IProjectDatasource>(PROJECT_DATASOURCE);

  list(criteria: ProjectFilterCriteria): Observable<PaginatedResult<Project>> {
    return this.datasource.fetchProjects(criteria).pipe(
      map((res) => ({
        items: ProjectMapper.toDomainList(res.items),
        total: res.total,
        page: res.page,
        pageSize: res.page_size,
        totalPages: Math.ceil(res.total / res.page_size),
      })),
    );
  }

  getById(id: string): Observable<Project> {
    return this.datasource.fetchProjectById(id).pipe(map((dto) => ProjectMapper.toDomain(dto)));
  }

  create(payload: CreateProjectPayload): Observable<Project> {
    const dto = ProjectMapper.toCreateDto(payload);
    return this.datasource.createProject(dto).pipe(map((resDto) => ProjectMapper.toDomain(resDto)));
  }

  update(id: string, payload: UpdateProjectPayload): Observable<Project> {
    const dto = ProjectMapper.toUpdateDto(payload);
    return this.datasource
      .updateProject(id, dto)
      .pipe(map((resDto) => ProjectMapper.toDomain(resDto)));
  }

  delete(id: string): Observable<void> {
    return this.datasource.deleteProject(id);
  }
}
