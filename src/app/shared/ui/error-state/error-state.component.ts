import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="error-state-root" role="alert">
      <div class="error-state-icon" aria-hidden="true">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3 class="error-state-title">{{ title }}</h3>
      @if (message) {
        <p class="error-state-desc">{{ message }}</p>
      }
      @if (showRetry) {
        <div class="error-state-actions">
          <app-button variant="primary" (btnClick)="onRetry()">
            {{ retryLabel }}
          </app-button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .error-state-root {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 3rem 1.5rem;
        background-color: var(--color-bg-surface);
        border: 1px solid var(--color-border-subtle);
        border-radius: 0.75rem;
      }

      .error-state-icon {
        color: var(--color-danger);
        margin-bottom: 1rem;
      }

      .error-state-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--color-text-primary);
        margin: 0 0 0.5rem 0;
      }

      .error-state-desc {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        max-width: 28rem;
        margin: 0 0 1.25rem 0;
        line-height: 1.5;
      }

      .error-state-actions {
        display: flex;
        gap: 0.75rem;
      }
    `,
  ],
})
export class ErrorStateComponent {
  @Input() title = 'Failed to load data';
  @Input() message = 'A network or server error occurred. Please try again.';
  @Input() retryLabel = 'Retry';
  @Input() showRetry = true;

  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
