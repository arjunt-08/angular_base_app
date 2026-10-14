import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-wrapper" [style.gap]="gap">
      @for (item of items; track $index) {
        <div
          class="skeleton-item"
          [class]="'skeleton-' + shape"
          [style.width]="width"
          [style.height]="height"
          aria-hidden="true"
        ></div>
      }
    </div>
  `,
  styles: [
    `
      .skeleton-wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
      }

      .skeleton-item {
        background: linear-gradient(
          90deg,
          var(--color-bg-muted) 0%,
          var(--color-border-subtle) 50%,
          var(--color-bg-muted) 100%
        );
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 0.375rem;
      }

      .skeleton-text {
        height: 1rem;
        border-radius: 0.25rem;
      }

      .skeleton-rect {
        border-radius: 0.5rem;
      }

      .skeleton-circle {
        border-radius: 50%;
      }

      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
    `,
  ],
})
export class SkeletonLoaderComponent {
  @Input() count = 1;
  @Input() shape: 'text' | 'rect' | 'circle' = 'text';
  @Input() width = '100%';
  @Input() height = '1.25rem';
  @Input() gap = '0.75rem';

  get items(): number[] {
    return Array.from({ length: this.count });
  }
}
