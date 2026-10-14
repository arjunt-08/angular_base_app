import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '@core/notification/notification.service';
import { NotificationMessage } from '@core/notification/notification.model';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-viewport" role="region" aria-label="Notifications" aria-live="polite">
      @for (toast of notifications(); track toast.id) {
        <div class="toast-item" [class]="'toast-' + toast.type" role="alert">
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') {
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              }
              @case ('warning') {
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <path
                    d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                  ></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              }
              @case ('error') {
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              }
              @default {
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              }
            }
          </div>

          <div class="toast-body">
            @if (toast.title) {
              <h4 class="toast-title">{{ toast.title }}</h4>
            }
            <p class="toast-message">{{ toast.message }}</p>
          </div>

          <button
            type="button"
            class="toast-dismiss"
            (click)="onDismiss(toast.id)"
            aria-label="Dismiss notification"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .toast-viewport {
        position: fixed;
        top: 1.25rem;
        right: 1.25rem;
        z-index: 2000;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        max-width: 24rem;
        width: calc(100% - 2.5rem);
        pointer-events: none;
      }

      .toast-item {
        pointer-events: auto;
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        padding: 0.875rem 1rem;
        background-color: var(--color-bg-surface);
        border-radius: 0.5rem;
        box-shadow: var(--shadow-dropdown);
        border: 1px solid var(--color-border-subtle);
        animation: toastSlideIn 200ms cubic-bezier(0.16, 1, 0.3, 1);
        transition: all 150ms ease;
      }

      .toast-icon {
        flex-shrink: 0;
        display: flex;
        margin-top: 0.125rem;
      }

      .toast-success {
        border-left: 4px solid var(--color-success);
        .toast-icon {
          color: var(--color-success);
        }
      }

      .toast-warning {
        border-left: 4px solid var(--color-warning);
        .toast-icon {
          color: var(--color-warning);
        }
      }

      .toast-error {
        border-left: 4px solid var(--color-danger);
        .toast-icon {
          color: var(--color-danger);
        }
      }

      .toast-info {
        border-left: 4px solid var(--color-secondary);
        .toast-icon {
          color: var(--color-secondary);
        }
      }

      .toast-body {
        flex: 1 1 auto;
      }

      .toast-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-text-primary);
        margin: 0 0 0.125rem 0;
      }

      .toast-message {
        font-size: 0.8125rem;
        color: var(--color-text-secondary);
        margin: 0;
        line-height: 1.4;
      }

      .toast-dismiss {
        flex-shrink: 0;
        color: var(--color-text-muted);
        padding: 0.25rem;
        border-radius: 0.25rem;
        display: flex;
        transition: color 150ms ease;

        &:hover {
          color: var(--color-text-primary);
        }
      }

      @keyframes toastSlideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `,
  ],
})
export class ToastContainerComponent {
  private readonly notificationService = inject(NotificationService);

  readonly notifications = this.notificationService.notifications;

  onDismiss(id: string): void {
    this.notificationService.dismiss(id);
  }
}
