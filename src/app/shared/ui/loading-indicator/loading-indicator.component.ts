import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-container" role="status">
      <div class="spinner" [class]="'spinner-' + size"></div>
      @if (text) {
        <span class="loader-text">{{ text }}</span>
      }
      <span class="visually-hidden">Loading...</span>
    </div>
  `,
  styles: [
    `
      .loader-container {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        padding: 1rem;
      }

      .spinner {
        border: 3px solid var(--color-border-subtle);
        border-top-color: var(--color-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }

      .spinner-sm {
        width: 1.25rem;
        height: 1.25rem;
        border-width: 2px;
      }
      .spinner-md {
        width: 2rem;
        height: 2rem;
        border-width: 3px;
      }
      .spinner-lg {
        width: 3rem;
        height: 3rem;
        border-width: 4px;
      }

      .loader-text {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        font-weight: 500;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class LoadingIndicatorComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() text = '';
}
