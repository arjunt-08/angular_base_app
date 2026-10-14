import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';
import { ButtonComponent, ButtonVariant } from '../button/button.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, ModalComponent, ButtonComponent],
  template: `
    <app-modal [isOpen]="isOpen" [title]="title" size="sm" (close)="onCancel()">
      <div class="confirm-content">
        @if (icon === 'danger') {
          <div class="confirm-icon danger">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
              ></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
        }
        <p class="confirm-message">{{ message }}</p>
      </div>

      <div modal-footer>
        <app-button variant="ghost" (btnClick)="onCancel()" [disabled]="loading">
          {{ cancelText }}
        </app-button>
        <app-button [variant]="confirmVariant" (btnClick)="onConfirm()" [loading]="loading">
          {{ confirmText }}
        </app-button>
      </div>
    </app-modal>
  `,
  styles: [
    `
      .confirm-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 1rem;
        padding: 0.5rem 0;
      }

      .confirm-icon {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        &.danger {
          background-color: var(--color-danger-subtle);
          color: var(--color-danger);
        }
      }

      .confirm-message {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        line-height: 1.5;
        margin: 0;
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Input() confirmVariant: ButtonVariant = 'danger';
  @Input() icon: 'danger' | 'info' | 'none' = 'danger';
  @Input() loading = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
