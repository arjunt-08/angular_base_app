import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetProjectsUseCase } from './get-projects.use-case';
import { ProjectRepository } from '../../domain/repositories/project.repository';
import { PaginatedResult } from '@shared/types/pagination.model';
import { Project } from '../../domain/models/project.model';

describe('GetProjectsUseCase', () => {
  let useCase: GetProjectsUseCase;
  let mockRepository: { list: ReturnType<typeof vi.fn> };

  const dummyResult: PaginatedResult<Project> = {
    items: [
      {
        id: 'p1',
        code: 'TST-1',
        name: 'Test Project',
        description: 'Test Description',
        status: 'active',
        priority: 'high',
        budget: 50000,
        leadName: 'John Doe',
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-02T00:00:00Z',
      },
    ],
    total: 1,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  };

  beforeEach(() => {
    mockRepository = {
      list: vi.fn().mockReturnValue(of(dummyResult)),
    };

    TestBed.configureTestingModule({
      providers: [GetProjectsUseCase, { provide: ProjectRepository, useValue: mockRepository }],
    });

    useCase = TestBed.inject(GetProjectsUseCase);
  });

  it('should call repository.list with sanitized pagination bounds', () => {
    useCase.execute({ page: -5, pageSize: 0, search: '  test  ' }).subscribe((res) => {
      expect(res).toEqual(dummyResult);
    });

    expect(mockRepository.list).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        pageSize: 10,
        search: 'test',
      }),
    );
  });

  it('should clamp maximum page size to 100', () => {
    useCase.execute({ page: 1, pageSize: 500 }).subscribe();

    expect(mockRepository.list).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        pageSize: 100,
      }),
    );
  });
});
