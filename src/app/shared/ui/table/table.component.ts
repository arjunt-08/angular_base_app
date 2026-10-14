import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-responsive" [class.table-bordered]="bordered">
      <table class="table-root" [class.table-striped]="striped" [class.table-hover]="hover">
        <ng-content></ng-content>
      </table>
    </div>
  `,
  styles: [
    `
      .table-responsive {
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        border-radius: 0.5rem;
      }

      .table-bordered {
        border: 1px solid var(--color-border-subtle);
      }

      .table-root {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
        font-size: 0.875rem;

        ::ng-deep th {
          padding: 0.75rem 1rem;
          background-color: var(--color-bg-muted);
          color: var(--color-text-secondary);
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--color-border-subtle);
          white-space: nowrap;
        }

        ::ng-deep td {
          padding: 0.875rem 1rem;
          color: var(--color-text-primary);
          border-bottom: 1px solid var(--color-border-subtle);
          vertical-align: middle;
        }
      }

      .table-striped ::ng-deep tbody tr:nth-child(even) {
        background-color: var(--color-bg-subtle);
      }

      .table-hover ::ng-deep tbody tr:hover {
        background-color: var(--color-bg-muted);
        transition: background-color 150ms ease;
      }
    `,
  ],
})
export class TableComponent {
  @Input() striped = true;
  @Input() hover = true;
  @Input() bordered = true;
}
