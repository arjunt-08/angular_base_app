import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProjectRepositoryImpl } from './project-repository.impl';
import {
  PROJECT_DATASOURCE,
  IProjectDatasource,
} from '../datasources/project-datasource.interface';
import { ProjectDto, ProjectListResponseDto } from '../dto/project.dto';

describe('ProjectRepositoryImpl', () => {
  let repository: ProjectRepositoryImpl;
  let mockDatasource: {
    fetchProjects: ReturnType<typeof vi.fn>;
    fetchProjectById: ReturnType<typeof vi.fn>;
    createProject: ReturnType<typeof vi.fn>;
    updateProject: ReturnType<typeof vi.fn>;
    deleteProject: ReturnType<typeof vi.fn>;
  };

  const dummyDto: ProjectDto = {
    id: 'proj_123',
    code: 'SEC-101',
    name: 'Security Audit',
    description: 'Enterprise penetration testing and architecture review',
    status: 'active',
    priority: 'critical',
    budget_amount: 125000,
    lead_name: 'Sarah Connor',
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-03-02T00:00:00Z',
  };

  const dummyListResponse: ProjectListResponseDto = {
    items: [dummyDto],
    total: 1,
    page: 1,
    page_size: 10,
  };

  beforeEach(() => {
    mockDatasource = {
      fetchProjects: vi.fn().mockReturnValue(of(dummyListResponse)),
      fetchProjectById: vi.fn().mockReturnValue(of(dummyDto)),
      createProject: vi.fn().mockReturnValue(of(dummyDto)),
      updateProject: vi.fn().mockReturnValue(of(dummyDto)),
      deleteProject: vi.fn().mockReturnValue(of(undefined)),
    };

    TestBed.configureTestingModule({
      providers: [ProjectRepositoryImpl, { provide: PROJECT_DATASOURCE, useValue: mockDatasource }],
    });

    repository = TestBed.inject(ProjectRepositoryImpl);
  });

  it('should map DTO list response to domain model with budget and leadName mapped correctly', () => {
    repository.list({ page: 1, pageSize: 10 }).subscribe((result) => {
      expect(result.items.length).toBe(1);
      const domain = result.items[0];
      expect(domain.id).toBe('proj_123');
      expect(domain.budget).toBe(125000); // mapped from budget_amount
      expect(domain.leadName).toBe('Sarah Connor'); // mapped from lead_name
      expect(result.totalPages).toBe(1);
    });

    expect(mockDatasource.fetchProjects).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
  });

  it('should fetch single project and map to domain entity', () => {
    repository.getById('proj_123').subscribe((project) => {
      expect(project.id).toBe('proj_123');
      expect(project.code).toBe('SEC-101');
      expect(project.budget).toBe(125000);
    });

    expect(mockDatasource.fetchProjectById).toHaveBeenCalledWith('proj_123');
  });
});
