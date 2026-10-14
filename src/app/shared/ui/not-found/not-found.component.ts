import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  template: `
    <div class="not-found-container">
      <div class="not-found-card">
        <span class="error-badge">404</span>
        <h1 class="error-title">Page Not Found</h1>
        <p class="error-desc">
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </p>
        <div class="actions">
          <a routerLink="/dashboard">
            <app-button variant="primary">Return to Dashboard</app-button>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .not-found-container {
        min-height: 80vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
      }

      .not-found-card {
        text-align: center;
        max-width: 28rem;
        background-color: var(--color-bg-surface);
        border: 1px solid var(--color-border-subtle);
        border-radius: 1rem;
        padding: 3rem 2rem;
        box-shadow: var(--shadow-card);
      }

      .error-badge {
        display: inline-block;
        font-size: 3.5rem;
        font-weight: 800;
        color: var(--color-primary);
        line-height: 1;
        margin-bottom: 1rem;
        letter-spacing: -0.05em;
      }

      .error-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-text-primary);
        margin: 0 0 0.75rem 0;
      }

      .error-desc {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        line-height: 1.5;
        margin: 0 0 2rem 0;
      }

      .actions {
        display: flex;
        justify-content: center;
      }
    `,
  ],
})
export class NotFoundComponent {}
