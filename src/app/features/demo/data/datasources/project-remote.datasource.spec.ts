import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ProjectRemoteDatasource } from './project-remote.datasource';
import { ProjectListResponseDto, CreateProjectRequestDto } from '../dto/project.dto';

describe('ProjectRemoteDatasource', () => {
  let datasource: ProjectRemoteDatasource;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), ProjectRemoteDatasource],
    });

    datasource = TestBed.inject(ProjectRemoteDatasource);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should issue GET request with appropriate query parameters', () => {
    const mockResponse: ProjectListResponseDto = {
      items: [],
      total: 0,
      page: 1,
      page_size: 10,
    };

    datasource.fetchProjects({ page: 2, pageSize: 15, search: 'cloud' }).subscribe((res) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpTesting.expectOne((r) => r.url === '/api/projects');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('pageSize')).toBe('15');
    expect(req.request.params.get('search')).toBe('cloud');

    req.flush(mockResponse);
  });

  it('should issue POST request to create project', () => {
    const newDto: CreateProjectRequestDto = {
      code: 'NEW-1',
      name: 'New Architecture',
      description: 'Building new foundation',
      status: 'planning',
      priority: 'high',
      budget_amount: 90000,
      lead_name: 'Lead PM',
    };

    datasource.createProject(newDto).subscribe((res) => {
      expect(res.id).toBe('proj_created_1');
    });

    const req = httpTesting.expectOne('/api/projects');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newDto);

    req.flush({ ...newDto, id: 'proj_created_1', created_at: '', updated_at: '' });
  });

  it('should issue DELETE request to remove project by ID', () => {
    datasource.deleteProject('proj_999').subscribe();

    const req = httpTesting.expectOne('/api/projects/proj_999');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
