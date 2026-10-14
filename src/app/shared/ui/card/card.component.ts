import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card-root" [class.card-hoverable]="hoverable">
      @if (title || subtitle) {
        <div class="card-header">
          <div class="card-header-titles">
            @if (title) {
              <h3 class="card-title">{{ title }}</h3>
            }
            @if (subtitle) {
              <p class="card-subtitle">{{ subtitle }}</p>
            }
          </div>
          <div class="card-header-actions">
            <ng-content select="[card-actions]"></ng-content>
          </div>
        </div>
      }

      <div class="card-body">
        <ng-content></ng-content>
      </div>

      <div class="card-footer">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .card-root {
        background-color: var(--color-bg-surface);
        border: 1px solid var(--color-border-subtle);
        border-radius: 0.75rem;
        box-shadow: var(--shadow-card);
        overflow: hidden;
        display: flex;
        flex-direction: column;
        transition:
          transform 200ms ease,
          box-shadow 200ms ease;
      }

      .card-hoverable:hover {
        box-shadow: var(--shadow-dropdown);
        transform: translateY(-2px);
      }

      .card-header {
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid var(--color-border-subtle);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
      }

      .card-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--color-text-primary);
        margin: 0;
      }

      .card-subtitle {
        font-size: 0.8125rem;
        color: var(--color-text-muted);
        margin-top: 0.25rem;
      }

      .card-body {
        padding: 1.5rem;
        flex: 1 1 auto;
      }

      .card-footer:empty {
        display: none;
      }

      .card-footer:not(:empty) {
        padding: 1rem 1.5rem;
        border-top: 1px solid var(--color-border-subtle);
        background-color: var(--color-bg-subtle);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.75rem;
      }
    `,
  ],
})
export class CardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() hoverable = false;
}
