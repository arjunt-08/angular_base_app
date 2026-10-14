import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectStateService } from './project-state.service';
import { GetProjectsUseCase } from '../use-cases/get-projects.use-case';
import { CreateProjectUseCase } from '../use-cases/create-project.use-case';
import { DeleteProjectUseCase } from '../use-cases/delete-project.use-case';
import { NotificationService } from '@core/notification/notification.service';
import { LoggerService } from '@core/logging/logger.service';
import { Project } from '../../domain/models/project.model';
import { PaginatedResult } from '@shared/types/pagination.model';
import { ProjectFilterCriteria } from '../../domain/models/project-filter.model';

describe('ProjectStateService', () => {
  let service: ProjectStateService;
  let mockGetProjects: { execute: ReturnType<typeof vi.fn> };
  let mockCreateProject: { execute: ReturnType<typeof vi.fn> };
  let mockDeleteProject: { execute: ReturnType<typeof vi.fn> };

  const dummyProject: Project = {
    id: 'p1',
    code: 'TEST-01',
    name: 'Sample Project',
    description: 'Sample Description',
    status: 'active',
    priority: 'medium',
    budget: 100000,
    leadName: 'Alice',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  beforeEach(() => {
    mockGetProjects = {
      execute: vi.fn().mockImplementation((criteria: ProjectFilterCriteria) =>
        of<PaginatedResult<Project>>({
          items: [dummyProject],
          total: 10,
          page: criteria.page,
          pageSize: criteria.pageSize,
          totalPages: Math.ceil(10 / criteria.pageSize),
        }),
      ),
    };
    mockCreateProject = {
      execute: vi.fn().mockReturnValue(of(dummyProject)),
    };
    mockDeleteProject = {
      execute: vi.fn().mockReturnValue(of(undefined)),
    };

    TestBed.configureTestingModule({
      providers: [
        ProjectStateService,
        { provide: GetProjectsUseCase, useValue: mockGetProjects },
        { provide: CreateProjectUseCase, useValue: mockCreateProject },
        { provide: DeleteProjectUseCase, useValue: mockDeleteProject },
        {
          provide: NotificationService,
          useValue: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
        },
        {
          provide: LoggerService,
          useValue: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
        },
      ],
    });

    service = TestBed.inject(ProjectStateService);
  });

  it('should have initial status before loading', () => {
    expect(service.status()).toBe('initial');
    expect(service.projects().length).toBe(0);
  });

  it('should transition to success status when data is returned', () => {
    service.loadProjects();

    expect(service.status()).toBe('success');
    expect(service.isSuccess()).toBe(true);
    expect(service.projects().length).toBe(1);
    expect(service.total()).toBe(10);
  });

  it('should transition to empty status when 0 items are returned', () => {
    mockGetProjects.execute.mockReturnValue(
      of<PaginatedResult<Project>>({
        items: [],
        total: 0,
        page: 1,
        pageSize: 5,
        totalPages: 1,
      }),
    );

    service.loadProjects();

    expect(service.status()).toBe('empty');
    expect(service.isEmpty()).toBe(true);
    expect(service.projects().length).toBe(0);
  });

  it('should transition to error status when use case fails', () => {
    mockGetProjects.execute.mockReturnValue(
      throwError(() => new Error('Server connection failure')),
    );

    service.loadProjects();

    expect(service.status()).toBe('error');
    expect(service.isError()).toBe(true);
    expect(service.error()).toBe('Server connection failure');
  });

  it('should update page and reload projects', () => {
    service.setPage(3);

    expect(service.page()).toBe(3);
    expect(mockGetProjects.execute).toHaveBeenCalledWith(expect.objectContaining({ page: 3 }));
  });

  it('should update status filter and reset page to 1', () => {
    service.setPage(4);
    service.setStatusFilter('planning');

    expect(service.page()).toBe(1);
    expect(service.statusFilter()).toBe('planning');
    expect(mockGetProjects.execute).toHaveBeenCalledWith(
      expect.objectContaining({ page: 1, status: 'planning' }),
    );
  });
});
