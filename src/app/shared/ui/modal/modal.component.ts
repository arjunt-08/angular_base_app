import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="modal-backdrop" (click)="onBackdropClick($event)" role="presentation">
        <div
          class="modal-dialog"
          [class]="'modal-' + size"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="title ? 'modal-title' : null"
        >
          <div class="modal-header">
            @if (title) {
              <h2 id="modal-title" class="modal-title">{{ title }}</h2>
            }
            <button
              type="button"
              class="modal-close-btn"
              (click)="onClose()"
              aria-label="Close dialog"
            >
              <svg
                width="18"
                height="18"
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

          <div class="modal-body">
            <ng-content></ng-content>
          </div>

          <div class="modal-footer">
            <ng-content select="[modal-footer]"></ng-content>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .modal-backdrop {
        position: fixed;
        inset: 0;
        background-color: rgba(15, 23, 42, 0.6);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        z-index: 1000;
        animation: fadeIn 150ms ease;
      }

      .modal-dialog {
        background-color: var(--color-bg-surface);
        border: 1px solid var(--color-border-subtle);
        border-radius: 0.75rem;
        box-shadow: var(--shadow-modal);
        width: 100%;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        animation: slideUp 200ms cubic-bezier(0.16, 1, 0.3, 1);
      }

      .modal-sm {
        max-width: 24rem;
      }
      .modal-md {
        max-width: 32rem;
      }
      .modal-lg {
        max-width: 42rem;
      }
      .modal-xl {
        max-width: 56rem;
      }

      .modal-header {
        padding: 1.25rem 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid var(--color-border-subtle);
      }

      .modal-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--color-text-primary);
        margin: 0;
      }

      .modal-close-btn {
        color: var(--color-text-muted);
        padding: 0.375rem;
        border-radius: 0.375rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition:
          background-color 150ms ease,
          color 150ms ease;

        &:hover {
          background-color: var(--color-bg-muted);
          color: var(--color-text-primary);
        }
      }

      .modal-body {
        padding: 1.5rem;
        overflow-y: auto;
        flex: 1 1 auto;
      }

      .modal-footer:empty {
        display: none;
      }

      .modal-footer:not(:empty) {
        padding: 1rem 1.5rem;
        border-top: 1px solid var(--color-border-subtle);
        background-color: var(--color-bg-subtle);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.75rem;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideUp {
        from {
          transform: translateY(12px) scale(0.98);
          opacity: 0;
        }
        to {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
      }
    `,
  ],
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: ModalSize = 'md';
  @Input() closeOnBackdrop = true;
  @Input() closeOnEscape = true;

  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen && this.closeOnEscape) {
      this.onClose();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop && event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onClose(): void {
    this.close.emit();
  }
}
