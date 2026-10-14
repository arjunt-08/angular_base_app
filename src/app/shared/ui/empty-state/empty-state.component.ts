import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="empty-state-root">
      <div class="empty-state-icon" aria-hidden="true">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
          ></path>
          <line x1="9" y1="14" x2="15" y2="14"></line>
        </svg>
      </div>
      <h3 class="empty-state-title">{{ title }}</h3>
      @if (description) {
        <p class="empty-state-desc">{{ description }}</p>
      }
      @if (actionLabel) {
        <div class="empty-state-actions">
          <app-button variant="primary" (btnClick)="onAction()">
            {{ actionLabel }}
          </app-button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .empty-state-root {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 3rem 1.5rem;
        background-color: var(--color-bg-surface);
        border: 1px dashed var(--color-border-base);
        border-radius: 0.75rem;
      }

      .empty-state-icon {
        color: var(--color-text-muted);
        margin-bottom: 1rem;
      }

      .empty-state-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--color-text-primary);
        margin: 0 0 0.5rem 0;
      }

      .empty-state-desc {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        max-width: 24rem;
        margin: 0 0 1.25rem 0;
        line-height: 1.5;
      }

      .empty-state-actions {
        display: flex;
        gap: 0.75rem;
      }
    `,
  ],
})
export class EmptyStateComponent {
  @Input() title = 'No items found';
  @Input() description = 'There is currently no data matching your criteria.';
  @Input() actionLabel = '';

  @Output() action = new EventEmitter<void>();

  onAction(): void {
    this.action.emit();
  }
}
