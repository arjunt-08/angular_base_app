import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProjectDatasource } from './project-datasource.interface';
import {
  ProjectDto,
  ProjectListResponseDto,
  CreateProjectRequestDto,
  UpdateProjectRequestDto,
} from '../dto/project.dto';
import { ProjectFilterCriteria } from '../../domain/models/project-filter.model';
import { toHttpParams } from '@shared/utils/http-params.util';

@Injectable()
export class ProjectRemoteDatasource implements IProjectDatasource {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/projects';

  fetchProjects(criteria: ProjectFilterCriteria): Observable<ProjectListResponseDto> {
    const params = toHttpParams({
      search: criteria.search,
      status: criteria.status !== 'all' ? criteria.status : undefined,
      page: criteria.page,
      pageSize: criteria.pageSize,
      sortBy: criteria.sortBy,
      sortOrder: criteria.sortOrder,
    });

    return this.http.get<ProjectListResponseDto>(this.endpoint, { params });
  }

  fetchProjectById(id: string): Observable<ProjectDto> {
    return this.http.get<ProjectDto>(`${this.endpoint}/${id}`);
  }

  createProject(dto: CreateProjectRequestDto): Observable<ProjectDto> {
    return this.http.post<ProjectDto>(this.endpoint, dto);
  }

  updateProject(id: string, dto: UpdateProjectRequestDto): Observable<ProjectDto> {
    return this.http.put<ProjectDto>(`${this.endpoint}/${id}`, dto);
  }

  deleteProject(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
