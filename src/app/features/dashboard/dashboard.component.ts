import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent } from '@shared/ui/card/card.component';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { ConfigService } from '@core/config/config.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, ButtonComponent],
  template: `
    <div class="dashboard-page">
      <!-- Welcome Hero -->
      <section class="hero-section">
        <div class="hero-content">
          <span class="hero-eyebrow">Production-Ready Foundation</span>
          <h1 class="hero-title">Angular Enterprise Starter Kit</h1>
          <p class="hero-description">
            A modular, testable, and strictly typed enterprise baseline built with Feature-Based
            Clean Architecture, Angular Signals, and centralized SCSS Design System.
          </p>
          <div class="hero-actions">
            <a routerLink="/demo">
              <app-button variant="primary" size="lg">Explore Portfolio Demo</app-button>
            </a>
            <a href="https://angular.dev" target="_blank" rel="noopener noreferrer">
              <app-button variant="outline" size="lg">Angular Docs</app-button>
            </a>
          </div>
        </div>
      </section>

      <!-- Key Architectural Pillars -->
      <section class="pillars-grid">
        <app-card
          title="Clean Architecture"
          subtitle="Domain & Application Separation"
          [hoverable]="true"
        >
          <p class="card-text">
            Strict separation: UI &rarr; State Store &rarr; Use Cases &rarr; Abstract Repositories
            &rarr; Data Sources. Domain is pure TypeScript with zero framework coupling.
          </p>
        </app-card>

        <app-card
          title="Angular Signals State"
          subtitle="Fine-Grained Reactivity"
          [hoverable]="true"
        >
          <p class="card-text">
            5-state async lifecycle (Initial, Loading, Success, Empty, Error) managed with signals,
            computed values, and RxJS for robust HTTP streaming.
          </p>
        </app-card>

        <app-card
          title="Enterprise Design System"
          subtitle="Centralized Tokens & Theming"
          [hoverable]="true"
        >
          <p class="card-text">
            Zero hardcoded colors. Runtime CSS custom variables with dark/light mode toggle,
            accessible UI primitives, dialogs, toasts, and responsive tables.
          </p>
        </app-card>

        <app-card
          title="Zero-Backend Ready"
          subtitle="Isolated Mock & HTTP Datasources"
          [hoverable]="true"
        >
          <p class="card-text">
            Launches immediately without backend credentials using realistic mock datasources.
            Switch to real HTTP endpoints by toggling dependency injection tokens.
          </p>
        </app-card>
      </section>

      <!-- Architecture Pipeline Banner -->
      <section class="pipeline-section">
        <app-card
          title="Standardized Dependency Inversion Flow"
          subtitle="Enforced by Angular Dependency Injection"
        >
          <div class="flow-steps">
            <div class="flow-step">
              <span class="step-num">1</span>
              <span class="step-name">Presentation UI</span>
              <span class="step-desc">Components & Forms</span>
            </div>
            <div class="flow-arrow">&rarr;</div>
            <div class="flow-step">
              <span class="step-num">2</span>
              <span class="step-name">State Store</span>
              <span class="step-desc">Signal Computed State</span>
            </div>
            <div class="flow-arrow">&rarr;</div>
            <div class="flow-step">
              <span class="step-num">3</span>
              <span class="step-name">Use Cases</span>
              <span class="step-desc">Application Logic</span>
            </div>
            <div class="flow-arrow">&rarr;</div>
            <div class="flow-step">
              <span class="step-num">4</span>
              <span class="step-name">Domain Repo</span>
              <span class="step-desc">Abstract Contract</span>
            </div>
            <div class="flow-arrow">&rarr;</div>
            <div class="flow-step">
              <span class="step-num">5</span>
              <span class="step-name">Datasource</span>
              <span class="step-desc">Mock or HttpClient</span>
            </div>
          </div>
        </app-card>
      </section>
    </div>
  `,
  styles: [
    `
      .dashboard-page {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }

      .hero-section {
        background: linear-gradient(135deg, var(--color-bg-surface) 0%, var(--color-bg-muted) 100%);
        border: 1px solid var(--color-border-subtle);
        border-radius: 1rem;
        padding: 2.5rem 2rem;
        box-shadow: var(--shadow-card);
      }

      .hero-eyebrow {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--color-primary);
        margin-bottom: 0.5rem;
        display: inline-block;
      }

      .hero-title {
        font-size: 2rem;
        font-weight: 800;
        color: var(--color-text-primary);
        margin: 0 0 1rem 0;
        letter-spacing: -0.03em;

        @media (min-width: 640px) {
          font-size: 2.5rem;
        }
      }

      .hero-description {
        font-size: 1rem;
        color: var(--color-text-secondary);
        max-width: 42rem;
        line-height: 1.6;
        margin: 0 0 1.75rem 0;
      }

      .hero-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .pillars-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;

        @media (min-width: 640px) {
          grid-template-columns: repeat(2, 1fr);
        }

        @media (min-width: 1024px) {
          grid-template-columns: repeat(4, 1fr);
        }
      }

      .card-text {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        line-height: 1.5;
        margin: 0;
      }

      .flow-steps {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        overflow-x: auto;
        padding: 1rem 0;
      }

      .flow-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        min-width: 8.5rem;
        padding: 1rem;
        background-color: var(--color-bg-subtle);
        border: 1px solid var(--color-border-subtle);
        border-radius: 0.5rem;
      }

      .step-num {
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 50%;
        background-color: var(--color-primary);
        color: var(--color-primary-contrast);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      .step-name {
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--color-text-primary);
      }

      .step-desc {
        font-size: 0.6875rem;
        color: var(--color-text-muted);
        margin-top: 0.25rem;
      }

      .flow-arrow {
        color: var(--color-text-muted);
        font-size: 1.25rem;
        font-weight: bold;
      }
    `,
  ],
})
export class DashboardComponent {
  readonly config = inject(ConfigService);
}
