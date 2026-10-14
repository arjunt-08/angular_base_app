import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from '@core/config/config.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="app-footer">
      <div class="footer-left">
        <span class="app-name">{{ config.appName }}</span>
        <span class="version-tag">v{{ config.appVersion }}</span>
      </div>
      <div class="footer-right">
        <span class="architecture-badge">Clean Architecture &bull; Signals &bull; Standalone</span>
      </div>
    </footer>
  `,
  styles: [
    `
      .app-footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid var(--color-border-subtle);
        background-color: var(--color-bg-surface);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        font-size: 0.75rem;
        color: var(--color-text-muted);
        margin-top: auto;
      }

      .footer-left {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .app-name {
        font-weight: 600;
        color: var(--color-text-secondary);
      }

      .version-tag {
        padding: 0.125rem 0.375rem;
        border-radius: 0.25rem;
        background-color: var(--color-bg-muted);
        font-family: var(--font-family-mono, monospace);
      }

      .architecture-badge {
        font-weight: 500;

        @media (max-width: 640px) {
          display: none;
        }
      }
    `,
  ],
})
export class FooterComponent {
  readonly config = inject(ConfigService);
}
