import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { IProjectDatasource } from './project-datasource.interface';
import {
  ProjectDto,
  ProjectListResponseDto,
  CreateProjectRequestDto,
  UpdateProjectRequestDto,
} from '../dto/project.dto';
import { ProjectFilterCriteria } from '../../domain/models/project-filter.model';
import { DuplicateProjectError, ProjectNotFoundError } from '../../domain/errors/project.errors';

@Injectable()
export class ProjectMockDatasource implements IProjectDatasource {
  private projects: ProjectDto[] = [
    {
      id: 'proj_01',
      code: 'CLD-901',
      name: 'Cloud Infrastructure Migration',
      description: 'Zero-downtime migration of core enterprise workloads to Google Cloud Platform.',
      status: 'active',
      priority: 'critical',
      budget_amount: 450000,
      lead_name: 'Sarah Connor',
      created_at: '2026-01-15T09:00:00Z',
      updated_at: '2026-03-10T14:22:00Z',
    },
    {
      id: 'proj_02',
      code: 'SEC-402',
      name: 'Zero-Trust IAM Rollout',
      description:
        'Federated single sign-on with multi-factor authentication and role-based policies.',
      status: 'active',
      priority: 'high',
      budget_amount: 180000,
      lead_name: 'Alex Rivera',
      created_at: '2026-02-01T11:30:00Z',
      updated_at: '2026-04-01T16:45:00Z',
    },
    {
      id: 'proj_03',
      code: 'DAT-103',
      name: 'Real-Time Telemetry Pipeline',
      description: 'Distributed event streaming and analytical dashboard for system performance.',
      status: 'planning',
      priority: 'medium',
      budget_amount: 220000,
      lead_name: 'Elena Rostova',
      created_at: '2026-03-01T08:15:00Z',
      updated_at: '2026-03-20T10:00:00Z',
    },
    {
      id: 'proj_04',
      code: 'AI-880',
      name: 'LLM Agent Assistant Integration',
      description: 'Autonomous customer support agent with strict retrieval augmented generation.',
      status: 'active',
      priority: 'critical',
      budget_amount: 600000,
      lead_name: 'Marcus Vance',
      created_at: '2026-01-10T14:00:00Z',
      updated_at: '2026-04-05T12:00:00Z',
    },
    {
      id: 'proj_05',
      code: 'MOB-505',
      name: 'Executive Mobile Portal',
      description: 'Native responsive dashboard for C-suite KPI monitoring and approvals.',
      status: 'completed',
      priority: 'high',
      budget_amount: 150000,
      lead_name: 'David Kim',
      created_at: '2025-10-12T10:00:00Z',
      updated_at: '2026-02-28T18:00:00Z',
    },
    {
      id: 'proj_06',
      code: 'ARC-306',
      name: 'Monolith to Micro-Frontends',
      description: 'Decomposition of legacy web portal into isolated module federation bundles.',
      status: 'active',
      priority: 'high',
      budget_amount: 320000,
      lead_name: 'Devin Zhao',
      created_at: '2026-02-14T09:30:00Z',
      updated_at: '2026-03-29T15:10:00Z',
    },
    {
      id: 'proj_07',
      code: 'FIN-707',
      name: 'Automated Billing & Invoicing Engine',
      description: 'High-throughput payment orchestration with Stripe and banking webhooks.',
      status: 'planning',
      priority: 'medium',
      budget_amount: 275000,
      lead_name: 'Nadia Patel',
      created_at: '2026-03-12T13:45:00Z',
      updated_at: '2026-04-02T11:20:00Z',
    },
    {
      id: 'proj_08',
      code: 'OPS-208',
      name: 'Kubernetes Multi-Region DR',
      description: 'Automated failover clusters across US-East and EU-West regions.',
      status: 'completed',
      priority: 'critical',
      budget_amount: 410000,
      lead_name: 'Liam Gallagher',
      created_at: '2025-08-01T08:00:00Z',
      updated_at: '2026-01-20T17:30:00Z',
    },
    {
      id: 'proj_09',
      code: 'LEG-109',
      name: 'Legacy CRM Sunsetting',
      description: 'Phased deprecation and data export into enterprise data lake.',
      status: 'archived',
      priority: 'low',
      budget_amount: 85000,
      lead_name: 'Claire Beauchamp',
      created_at: '2025-05-10T10:00:00Z',
      updated_at: '2025-12-15T16:00:00Z',
    },
    {
      id: 'proj_10',
      code: 'DEV-610',
      name: 'Internal Developer Platform',
      description: 'Self-service environment provisioning, ephemeral PR environments, and metrics.',
      status: 'active',
      priority: 'medium',
      budget_amount: 195000,
      lead_name: 'Vikram Joshi',
      created_at: '2026-02-20T14:15:00Z',
      updated_at: '2026-04-08T09:00:00Z',
    },
  ];

  fetchProjects(criteria: ProjectFilterCriteria): Observable<ProjectListResponseDto> {
    let filtered = [...this.projects];

    if (criteria.search) {
      const q = criteria.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.lead_name.toLowerCase().includes(q),
      );
    }

    if (criteria.status && criteria.status !== 'all') {
      filtered = filtered.filter((p) => p.status === criteria.status);
    }

    const total = filtered.length;
    const page = criteria.page || 1;
    const pageSize = criteria.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const items = filtered.slice(startIndex, startIndex + pageSize);

    const response: ProjectListResponseDto = {
      items,
      total,
      page,
      page_size: pageSize,
    };

    return of(response).pipe(delay(250));
  }

  fetchProjectById(id: string): Observable<ProjectDto> {
    const found = this.projects.find((p) => p.id === id);
    if (!found) {
      return throwError(() => new ProjectNotFoundError(id));
    }
    return of({ ...found }).pipe(delay(150));
  }

  createProject(dto: CreateProjectRequestDto): Observable<ProjectDto> {
    const existingCode = this.projects.some((p) => p.code.toLowerCase() === dto.code.toLowerCase());
    if (existingCode) {
      return throwError(() => new DuplicateProjectError(dto.code));
    }

    const newProject: ProjectDto = {
      id: `proj_${Date.now()}`,
      code: dto.code,
      name: dto.name,
      description: dto.description,
      status: dto.status as ProjectDto['status'],
      priority: dto.priority as ProjectDto['priority'],
      budget_amount: dto.budget_amount,
      lead_name: dto.lead_name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.projects = [newProject, ...this.projects];
    return of(newProject).pipe(delay(200));
  }

  updateProject(id: string, dto: UpdateProjectRequestDto): Observable<ProjectDto> {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) {
      return throwError(() => new ProjectNotFoundError(id));
    }

    const current = this.projects[index];
    const updated: ProjectDto = {
      ...current,
      ...(dto.name && { name: dto.name }),
      ...(dto.code && { code: dto.code }),
      ...(dto.description && { description: dto.description }),
      ...(dto.status && { status: dto.status as ProjectDto['status'] }),
      ...(dto.priority && { priority: dto.priority as ProjectDto['priority'] }),
      ...(dto.budget_amount !== undefined && { budget_amount: dto.budget_amount }),
      ...(dto.lead_name && { lead_name: dto.lead_name }),
      updated_at: new Date().toISOString(),
    };

    this.projects[index] = updated;
    return of(updated).pipe(delay(200));
  }

  deleteProject(id: string): Observable<void> {
    const index = this.projects.findIndex((p) => p.id === id);
    if (index === -1) {
      return throwError(() => new ProjectNotFoundError(id));
    }

    this.projects = this.projects.filter((p) => p.id !== id);
    return of(undefined).pipe(delay(200));
  }
}
