import { Injectable, computed, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { GetProjectsUseCase } from '../use-cases/get-projects.use-case';
import { CreateProjectUseCase } from '../use-cases/create-project.use-case';
import { DeleteProjectUseCase } from '../use-cases/delete-project.use-case';
import { Project, CreateProjectPayload, ProjectStatus } from '../../domain/models/project.model';
import { ProjectFilterCriteria } from '../../domain/models/project-filter.model';
import { AsyncStatus } from '@shared/types/async-state.model';
import { NotificationService } from '@core/notification/notification.service';
import { LoggerService } from '@core/logging/logger.service';

export interface ProjectStateModel {
  status: AsyncStatus;
  projects: Project[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  statusFilter: ProjectStatus | 'all';
  error: string | null;
  errorCode: string | null;
  simulateApiError: boolean;
}

@Injectable()
export class ProjectStateService {
  private readonly getProjectsUseCase = inject(GetProjectsUseCase);
  private readonly createProjectUseCase = inject(CreateProjectUseCase);
  private readonly deleteProjectUseCase = inject(DeleteProjectUseCase);
  private readonly notifications = inject(NotificationService);
  private readonly logger = inject(LoggerService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly searchSubject = new Subject<string>();

  // State Signal
  private readonly state = signal<ProjectStateModel>({
    status: 'initial',
    projects: [],
    total: 0,
    page: 1,
    pageSize: 5,
    search: '',
    statusFilter: 'all',
    error: null,
    errorCode: null,
    simulateApiError: false,
  });

  // Selectors / Computed Signals
  readonly status = computed(() => this.state().status);
  readonly projects = computed(() => this.state().projects);
  readonly total = computed(() => this.state().total);
  readonly page = computed(() => this.state().page);
  readonly pageSize = computed(() => this.state().pageSize);
  readonly search = computed(() => this.state().search);
  readonly statusFilter = computed(() => this.state().statusFilter);
  readonly error = computed(() => this.state().error);
  readonly simulateApiError = computed(() => this.state().simulateApiError);

  readonly isLoading = computed(() => this.status() === 'loading');
  readonly isSuccess = computed(() => this.status() === 'success');
  readonly isEmpty = computed(() => this.status() === 'empty');
  readonly isError = computed(() => this.status() === 'error');

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize())));

  constructor() {
    // Setup debounced search subscription
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((term) => {
          this.state.update((s) => ({ ...s, search: term, page: 1 }));
          this.loadProjects();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  loadProjects(): void {
    const currentState = this.state();

    this.state.update((s) => ({
      ...s,
      status: 'loading',
      error: null,
      errorCode: null,
    }));

    if (currentState.simulateApiError) {
      setTimeout(() => {
        const errorMsg = 'Simulated Enterprise Gateway 503 Service Unavailable';
        this.state.update((s) => ({
          ...s,
          status: 'error',
          error: errorMsg,
          errorCode: 'SERVER_ERROR',
        }));
        this.notifications.error(errorMsg, 'API Simulation Error');
        this.logger.warn('Simulated API failure triggered in ProjectStateService', 'ProjectState');
      }, 500);
      return;
    }

    const criteria: ProjectFilterCriteria = {
      search: currentState.search,
      status: currentState.statusFilter,
      page: currentState.page,
      pageSize: currentState.pageSize,
    };

    this.getProjectsUseCase
      .execute(criteria)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          const isEmpty = result.items.length === 0;
          this.state.update((s) => ({
            ...s,
            status: isEmpty ? 'empty' : 'success',
            projects: result.items,
            total: result.total,
            page: result.page,
            pageSize: result.pageSize,
            error: null,
          }));
        },
        error: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Failed to retrieve projects.';
          this.state.update((s) => ({
            ...s,
            status: 'error',
            error: message,
            errorCode: 'HTTP_ERROR',
          }));
          this.notifications.error(message, 'Query Error');
          this.logger.error('Failed to load projects', 'ProjectStateService', err);
        },
      });
  }

  setSearchTerm(term: string): void {
    this.searchSubject.next(term);
  }

  setStatusFilter(status: ProjectStatus | 'all'): void {
    this.state.update((s) => ({ ...s, statusFilter: status, page: 1 }));
    this.loadProjects();
  }

  setPage(page: number): void {
    this.state.update((s) => ({ ...s, page }));
    this.loadProjects();
  }

  setPageSize(pageSize: number): void {
    this.state.update((s) => ({ ...s, pageSize, page: 1 }));
    this.loadProjects();
  }

  createProject(payload: CreateProjectPayload, onSuccess?: () => void): void {
    this.createProjectUseCase
      .execute(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (created) => {
          this.notifications.success(
            `Project "${created.name}" created successfully.`,
            'Project Created',
          );
          this.loadProjects();
          onSuccess?.();
        },
        error: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Could not create project.';
          this.notifications.error(message, 'Creation Failed');
        },
      });
  }

  deleteProject(id: string, projectName: string, onSuccess?: () => void): void {
    this.deleteProjectUseCase
      .execute(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notifications.success(`Project "${projectName}" was removed.`, 'Project Deleted');
          this.loadProjects();
          onSuccess?.();
        },
        error: (err: unknown) => {
          const message = err instanceof Error ? err.message : 'Could not delete project.';
          this.notifications.error(message, 'Deletion Failed');
        },
      });
  }

  toggleSimulateApiError(): void {
    this.state.update((s) => ({
      ...s,
      simulateApiError: !s.simulateApiError,
    }));
  }

  resetFilters(): void {
    this.state.update((s) => ({
      ...s,
      search: '',
      statusFilter: 'all',
      page: 1,
      simulateApiError: false,
    }));
    this.loadProjects();
  }

  retry(): void {
    this.loadProjects();
  }
}
