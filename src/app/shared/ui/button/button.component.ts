import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="
        'btn btn-' +
        variant +
        ' btn-' +
        size +
        (fullWidth ? ' btn-block' : '') +
        (loading ? ' btn-loading' : '')
      "
      (click)="onClick($event)"
      [attr.aria-busy]="loading"
    >
      @if (loading) {
        <span class="spinner" aria-hidden="true"></span>
      }
      <span class="btn-content" [class.invisible]="loading">
        <ng-content></ng-content>
      </span>
    </button>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }

      .btn {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-weight: 500;
        border-radius: 0.5rem;
        border: 1px solid transparent;
        cursor: pointer;
        transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
        outline: none;
        white-space: nowrap;
        user-select: none;
        line-height: 1.25;

        &:focus-visible {
          box-shadow: var(--focus-ring);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }

      .btn-block {
        width: 100%;
      }

      // Sizes
      .btn-sm {
        padding: 0.375rem 0.75rem;
        font-size: 0.75rem;
      }

      .btn-md {
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
      }

      .btn-lg {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
      }

      // Variants
      .btn-primary {
        background-color: var(--color-primary);
        color: var(--color-primary-contrast);

        &:hover:not(:disabled) {
          background-color: var(--color-primary-hover);
        }
      }

      .btn-secondary {
        background-color: var(--color-bg-muted);
        color: var(--color-text-primary);
        border-color: var(--color-border-subtle);

        &:hover:not(:disabled) {
          background-color: var(--color-border-subtle);
        }
      }

      .btn-outline {
        background-color: transparent;
        color: var(--color-text-primary);
        border-color: var(--color-border-base);

        &:hover:not(:disabled) {
          background-color: var(--color-bg-muted);
          border-color: var(--color-border-strong);
        }
      }

      .btn-ghost {
        background-color: transparent;
        color: var(--color-text-secondary);

        &:hover:not(:disabled) {
          background-color: var(--color-bg-muted);
          color: var(--color-text-primary);
        }
      }

      .btn-danger {
        background-color: var(--color-danger);
        color: var(--color-danger-contrast);

        &:hover:not(:disabled) {
          background-color: var(--color-danger-hover);
        }
      }

      // Spinner
      .spinner {
        position: absolute;
        width: 1rem;
        height: 1rem;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: spin 0.75s linear infinite;
      }

      .invisible {
        visibility: hidden;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() loading = false;
  @Input() disabled = false;
  @Input() fullWidth = false;

  @Output() btnClick = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.btnClick.emit(event);
    }
  }
}
