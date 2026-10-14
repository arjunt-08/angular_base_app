import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectStateService } from '../application/state/project-state.service';
import { Project, CreateProjectPayload } from '../domain/models/project.model';
import { TableComponent } from '@shared/ui/table/table.component';
import { PaginationComponent } from '@shared/ui/pagination/pagination.component';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { CardComponent } from '@shared/ui/card/card.component';
import { SkeletonLoaderComponent } from '@shared/ui/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '@shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '@shared/ui/error-state/error-state.component';
import { ConfirmDialogComponent } from '@shared/ui/confirm-dialog/confirm-dialog.component';
import { DemoFormModalComponent } from './demo-form-modal/demo-form-modal.component';
import { StatusBadgePipe } from '@shared/pipes/status-badge.pipe';
import { TruncatePipe } from '@shared/pipes/truncate.pipe';
import { RelativeTimePipe } from '@shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-demo-list',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    PaginationComponent,
    ButtonComponent,
    CardComponent,
    SkeletonLoaderComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    ConfirmDialogComponent,
    DemoFormModalComponent,
    StatusBadgePipe,
    TruncatePipe,
    RelativeTimePipe,
  ],
  template: `
    <div class="demo-page">
      <!-- Page Header -->
      <div class="page-title-row">
        <div>
          <h1 class="page-heading">Enterprise Portfolio Management</h1>
          <p class="page-subheading">
            Live demonstration of Clean Architecture: UI &rarr; State &rarr; Use Case &rarr;
            Repository &rarr; Datasource
          </p>
        </div>
        <div class="header-actions">
          <app-button variant="primary" (btnClick)="openCreateModal()">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Project
          </app-button>
        </div>
      </div>

      <!-- Architecture Testing Bar -->
      <div class="architecture-bar" [class.simulating-error]="state.simulateApiError()">
        <div class="arch-info">
          <span class="arch-badge">Active Datasource</span>
          <span class="arch-text">In-Memory Mock Datasource (Swappable via DI to HTTP)</span>
        </div>
        <div class="arch-controls">
          <app-button
            [variant]="state.simulateApiError() ? 'danger' : 'outline'"
            size="sm"
            (btnClick)="onToggleSimulateError()"
          >
            {{
              state.simulateApiError() ? 'Disable Failure Simulation' : 'Simulate API Failure (503)'
            }}
          </app-button>
          <app-button variant="ghost" size="sm" (btnClick)="state.retry()">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="23 4 23 10 17 10"></polyline>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
            </svg>
            Refresh
          </app-button>
        </div>
      </div>

      <!-- Filter Controls Card -->
      <app-card>
        <div class="filter-controls">
          <div class="search-box">
            <svg
              class="search-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              class="search-input"
              placeholder="Search by code, project name, or lead..."
              [value]="state.search()"
              (input)="onSearchInput($event)"
            />
          </div>

          <div class="status-filters">
            <button
              type="button"
              class="filter-pill"
              [class.active]="state.statusFilter() === 'all'"
              (click)="onStatusChange('all')"
            >
              All
            </button>
            <button
              type="button"
              class="filter-pill"
              [class.active]="state.statusFilter() === 'active'"
              (click)="onStatusChange('active')"
            >
              Active
            </button>
            <button
              type="button"
              class="filter-pill"
              [class.active]="state.statusFilter() === 'planning'"
              (click)="onStatusChange('planning')"
            >
              Planning
            </button>
            <button
              type="button"
              class="filter-pill"
              [class.active]="state.statusFilter() === 'completed'"
              (click)="onStatusChange('completed')"
            >
              Completed
            </button>
          </div>
        </div>
      </app-card>

      <!-- Main Data Area (Handles All 5 Async States) -->
      @if (state.isLoading()) {
        <!-- State 1: Loading Skeleton -->
        <app-card>
          <div class="skeleton-table">
            <app-skeleton-loader [count]="6" height="2.25rem" gap="1rem"></app-skeleton-loader>
          </div>
        </app-card>
      } @else if (state.isError()) {
        <!-- State 2: Error State -->
        <app-error-state
          title="Could Not Retrieve Portfolio Data"
          [message]="state.error() || 'An unexpected communication error occurred.'"
          (retry)="state.retry()"
        ></app-error-state>
      } @else if (state.isEmpty()) {
        <!-- State 3: Empty State -->
        <app-empty-state
          title="No Matching Projects Found"
          description="Try adjusting your search criteria or reset filters to view all portfolio items."
          actionLabel="Reset Filters"
          (action)="state.resetFilters()"
        ></app-empty-state>
      } @else if (state.isSuccess()) {
        <!-- State 4: Success State with Table and Pagination -->
        <app-card>
          <app-table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Project Details</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Budget</th>
                <th>Lead</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (item of state.projects(); track item.id) {
                <tr>
                  <td>
                    <span class="code-pill">{{ item.code }}</span>
                  </td>
                  <td>
                    <div class="project-title">{{ item.name }}</div>
                    <div class="project-desc">{{ item.description | truncate: 60 }}</div>
                  </td>
                  <td>
                    @let badge = item.status | statusBadge;
                    <span class="badge" [class]="'badge-' + badge.variant">
                      {{ badge.label }}
                    </span>
                  </td>
                  <td>
                    <span class="priority-tag" [class]="'priority-' + item.priority">
                      {{ item.priority }}
                    </span>
                  </td>
                  <td class="font-medium">
                    {{ item.budget | currency: 'USD' : 'symbol' : '1.0-0' }}
                  </td>
                  <td>
                    <div class="lead-name">{{ item.leadName }}</div>
                    <div class="project-desc">{{ item.createdAt | relativeTime }}</div>
                  </td>
                  <td style="text-align: right;">
                    <button
                      type="button"
                      class="delete-btn"
                      (click)="confirmDelete(item)"
                      aria-label="Delete project"
                      title="Delete Project"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path
                          d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                        ></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </app-table>

          <app-pagination
            [currentPage]="state.page()"
            [pageSize]="state.pageSize()"
            [total]="state.total()"
            (pageChange)="state.setPage($event)"
          ></app-pagination>
        </app-card>
      }

      <!-- Create Project Modal -->
      <app-demo-form-modal
        [isOpen]="createModalOpen()"
        (close)="closeCreateModal()"
        (formSubmit)="onCreateSubmit($event)"
      ></app-demo-form-modal>

      <!-- Delete Confirmation Dialog -->
      <app-confirm-dialog
        [isOpen]="deleteDialogOpen()"
        title="Confirm Project Deletion"
        [message]="deleteMessage"
        confirmText="Delete Project"
        confirmVariant="danger"
        (confirm)="executeDelete()"
        (cancel)="closeDeleteDialog()"
      ></app-confirm-dialog>
    </div>
  `,
  styles: [
    `
      .demo-page {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .page-title-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .page-heading {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-text-primary);
        margin: 0 0 0.25rem 0;
      }

      .page-subheading {
        font-size: 0.875rem;
        color: var(--color-text-muted);
        margin: 0;
      }

      .architecture-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.75rem 1.25rem;
        background-color: var(--color-bg-surface);
        border: 1px solid var(--color-border-subtle);
        border-radius: 0.5rem;
        flex-wrap: wrap;

        &.simulating-error {
          border-color: var(--color-danger);
          background-color: var(--color-danger-subtle);
        }
      }

      .arch-info {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .arch-badge {
        font-size: 0.6875rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        background-color: var(--color-primary-subtle);
        color: var(--color-primary);
      }

      .arch-text {
        font-size: 0.8125rem;
        color: var(--color-text-secondary);
        font-weight: 500;
      }

      .arch-controls {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .filter-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .search-box {
        position: relative;
        display: flex;
        align-items: center;
        flex: 1 1 16rem;
        max-width: 28rem;
      }

      .search-icon {
        position: absolute;
        left: 0.75rem;
        color: var(--color-text-muted);
        pointer-events: none;
      }

      .search-input {
        width: 100%;
        height: 2.25rem;
        padding: 0 0.75rem 0 2.25rem;
        font-size: 0.875rem;
        color: var(--color-text-primary);
        background-color: var(--color-bg-base);
        border: 1px solid var(--color-border-base);
        border-radius: 0.5rem;
        outline: none;

        &:focus {
          border-color: var(--color-primary);
          box-shadow: var(--focus-ring);
        }
      }

      .status-filters {
        display: flex;
        gap: 0.375rem;
        overflow-x: auto;
      }

      .filter-pill {
        padding: 0.375rem 0.75rem;
        font-size: 0.8125rem;
        font-weight: 500;
        border-radius: 9999px;
        border: 1px solid var(--color-border-subtle);
        background-color: var(--color-bg-surface);
        color: var(--color-text-secondary);
        cursor: pointer;
        transition: all 150ms ease;

        &:hover {
          background-color: var(--color-bg-muted);
          color: var(--color-text-primary);
        }

        &.active {
          background-color: var(--color-primary);
          border-color: var(--color-primary);
          color: var(--color-primary-contrast);
        }
      }

      .skeleton-table {
        padding: 1.5rem 0;
      }

      .code-pill {
        font-family: var(--font-family-mono, monospace);
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
        background-color: var(--color-bg-muted);
        color: var(--color-primary);
        border: 1px solid var(--color-border-subtle);
      }

      .project-title {
        font-weight: 600;
        color: var(--color-text-primary);
      }

      .project-desc {
        font-size: 0.75rem;
        color: var(--color-text-muted);
        margin-top: 0.125rem;
      }

      .badge {
        display: inline-block;
        padding: 0.25rem 0.625rem;
        font-size: 0.6875rem;
        font-weight: 600;
        border-radius: 9999px;
        text-transform: capitalize;

        &.badge-success {
          background-color: var(--color-success-subtle);
          color: var(--color-success);
        }
        &.badge-warning {
          background-color: var(--color-warning-subtle);
          color: var(--color-warning);
        }
        &.badge-neutral {
          background-color: var(--color-bg-muted);
          color: var(--color-text-secondary);
        }
        &.badge-danger {
          background-color: var(--color-danger-subtle);
          color: var(--color-danger);
        }
      }

      .priority-tag {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: capitalize;

        &.priority-critical {
          color: var(--color-danger);
        }
        &.priority-high {
          color: var(--color-warning);
        }
        &.priority-medium {
          color: var(--color-secondary);
        }
        &.priority-low {
          color: var(--color-text-muted);
        }
      }

      .font-medium {
        font-weight: 500;
      }

      .delete-btn {
        color: var(--color-text-muted);
        padding: 0.375rem;
        border-radius: 0.375rem;
        display: inline-flex;
        transition: all 150ms ease;

        &:hover {
          background-color: var(--color-danger-subtle);
          color: var(--color-danger);
        }
      }
    `,
  ],
})
export class DemoListComponent implements OnInit {
  readonly state = inject(ProjectStateService);

  readonly createModalOpen = signal(false);
  readonly deleteDialogOpen = signal(false);
  readonly projectToDelete = signal<Project | null>(null);

  get deleteMessage(): string {
    const name = this.projectToDelete()?.name ?? '';
    return `Are you sure you want to delete project "${name}"? This action cannot be undone.`;
  }

  ngOnInit(): void {
    this.state.loadProjects();
  }

  onSearchInput(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.state.setSearchTerm(term);
  }

  onStatusChange(status: string): void {
    this.state.setStatusFilter(status as Project['status'] | 'all');
  }

  onToggleSimulateError(): void {
    this.state.toggleSimulateApiError();
    this.state.loadProjects();
  }

  openCreateModal(): void {
    this.createModalOpen.set(true);
  }

  closeCreateModal(): void {
    this.createModalOpen.set(false);
  }

  onCreateSubmit(payload: CreateProjectPayload): void {
    this.state.createProject(payload, () => {
      this.closeCreateModal();
    });
  }

  confirmDelete(project: Project): void {
    this.projectToDelete.set(project);
    this.deleteDialogOpen.set(true);
  }

  closeDeleteDialog(): void {
    this.deleteDialogOpen.set(false);
    this.projectToDelete.set(null);
  }

  executeDelete(): void {
    const project = this.projectToDelete();
    if (!project) return;

    this.state.deleteProject(project.id, project.name, () => {
      this.closeDeleteDialog();
    });
  }
}
