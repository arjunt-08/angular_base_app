import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagination-container">
      <div class="pagination-info">
        Showing
        <span class="font-medium">{{ startItem }}</span>
        to
        <span class="font-medium">{{ endItem }}</span>
        of
        <span class="font-medium">{{ total }}</span>
        results
      </div>

      <div class="pagination-controls">
        <button
          type="button"
          class="page-btn nav-btn"
          [disabled]="currentPage <= 1"
          (click)="onPageChange(currentPage - 1)"
          aria-label="Previous page"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        @for (p of visiblePages; track p) {
          @if (p === -1) {
            <span class="page-ellipsis">&hellip;</span>
          } @else {
            <button
              type="button"
              class="page-btn"
              [class.active]="p === currentPage"
              (click)="onPageChange(p)"
              [attr.aria-current]="p === currentPage ? 'page' : null"
            >
              {{ p }}
            </button>
          }
        }

        <button
          type="button"
          class="page-btn nav-btn"
          [disabled]="currentPage >= totalPages"
          (click)="onPageChange(currentPage + 1)"
          aria-label="Next page"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .pagination-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        padding: 0.875rem 0.5rem;
        font-size: 0.875rem;
        color: var(--color-text-secondary);

        @media (min-width: 640px) {
          flex-direction: row;
        }
      }

      .font-medium {
        font-weight: 600;
        color: var(--color-text-primary);
      }

      .pagination-controls {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
      }

      .page-btn {
        min-width: 2rem;
        height: 2rem;
        padding: 0 0.5rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.375rem;
        border: 1px solid var(--color-border-subtle);
        background-color: var(--color-bg-surface);
        color: var(--color-text-secondary);
        font-size: 0.8125rem;
        font-weight: 500;
        transition: all 150ms ease;

        &:hover:not(:disabled):not(.active) {
          background-color: var(--color-bg-muted);
          color: var(--color-text-primary);
        }

        &.active {
          background-color: var(--color-primary);
          border-color: var(--color-primary);
          color: var(--color-primary-contrast);
        }

        &:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      }

      .page-ellipsis {
        padding: 0 0.25rem;
        color: var(--color-text-muted);
      }
    `,
  ],
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() pageSize = 10;
  @Input() total = 0;

  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  get startItem(): number {
    if (this.total === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.total);
  }

  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 1;

    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const range: number[] = [];
    const rangeWithDots: number[] = [];
    let l: number | undefined;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push(-1);
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
