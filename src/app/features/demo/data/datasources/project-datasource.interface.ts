import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ProjectDto,
  ProjectListResponseDto,
  CreateProjectRequestDto,
  UpdateProjectRequestDto,
} from '../dto/project.dto';
import { ProjectFilterCriteria } from '../../domain/models/project-filter.model';

export interface IProjectDatasource {
  fetchProjects(criteria: ProjectFilterCriteria): Observable<ProjectListResponseDto>;
  fetchProjectById(id: string): Observable<ProjectDto>;
  createProject(dto: CreateProjectRequestDto): Observable<ProjectDto>;
  updateProject(id: string, dto: UpdateProjectRequestDto): Observable<ProjectDto>;
  deleteProject(id: string): Observable<void>;
}

export const PROJECT_DATASOURCE = new InjectionToken<IProjectDatasource>('PROJECT_DATASOURCE');
