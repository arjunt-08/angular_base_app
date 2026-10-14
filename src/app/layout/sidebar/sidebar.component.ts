import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from '../navigation/navigation.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="app-sidebar" [class.open]="isOpen">
      <div class="sidebar-brand">
        <div class="brand-logo" aria-hidden="true">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-title">ApexCore</span>
          <span class="brand-badge">Starter Kit</span>
        </div>
      </div>

      <nav class="sidebar-nav" aria-label="Main Navigation">
        <div class="nav-section-title">Navigation</div>
        <ul class="nav-list">
          @for (item of navItems; track item.id) {
            <li class="nav-item">
              <a
                [routerLink]="item.route"
                routerLinkActive="active"
                [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
                class="nav-link"
                (click)="onLinkClick()"
              >
                <span class="nav-icon" [innerHTML]="item.icon"></span>
                <span class="nav-label">{{ item.label }}</span>
                @if (item.badge) {
                  <span class="nav-badge" [class]="'badge-' + (item.badgeVariant || 'primary')">
                    {{ item.badge }}
                  </span>
                }
              </a>
            </li>
          }
        </ul>
      </nav>

      <div class="sidebar-footer">
        <div class="runtime-info">
          <span class="env-dot" aria-hidden="true"></span>
          <span class="env-text">Angular Enterprise 22</span>
        </div>
      </div>
    </aside>
  `,
  styles: [
    `
      .app-sidebar {
        width: 16rem;
        height: 100vh;
        background-color: var(--color-bg-surface);
        border-right: 1px solid var(--color-border-subtle);
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 105;
        transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1);

        @media (max-width: 1023px) {
          transform: translateX(-100%);

          &.open {
            transform: translateX(0);
          }
        }

        @media (min-width: 1024px) {
          position: sticky;
          top: 0;
          transform: none;
        }
      }

      .sidebar-brand {
        height: 4rem;
        padding: 0 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        border-bottom: 1px solid var(--color-border-subtle);
      }

      .brand-logo {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 0.5rem;
        background: linear-gradient(135deg, var(--color-primary) 0%, #a855f7 100%);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(79, 70, 229, 0.25);
      }

      .brand-text {
        display: flex;
        flex-direction: column;
        line-height: 1.2;
      }

      .brand-title {
        font-size: 1rem;
        font-weight: 700;
        color: var(--color-text-primary);
        letter-spacing: -0.02em;
      }

      .brand-badge {
        font-size: 0.6875rem;
        font-weight: 500;
        color: var(--color-primary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .sidebar-nav {
        flex: 1 1 auto;
        padding: 1.5rem 1rem;
        overflow-y: auto;
      }

      .nav-section-title {
        font-size: 0.6875rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--color-text-muted);
        padding: 0 0.75rem 0.625rem;
      }

      .nav-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .nav-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.625rem 0.75rem;
        border-radius: 0.5rem;
        color: var(--color-text-secondary);
        font-size: 0.875rem;
        font-weight: 500;
        transition: all 150ms ease;

        &:hover {
          background-color: var(--color-bg-muted);
          color: var(--color-text-primary);
        }

        &.active {
          background-color: var(--color-primary-subtle);
          color: var(--color-primary);
          font-weight: 600;

          .nav-icon {
            color: var(--color-primary);
          }
        }
      }

      .nav-icon {
        width: 1.25rem;
        height: 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-muted);
      }

      .nav-label {
        flex: 1 1 auto;
      }

      .nav-badge {
        padding: 0.125rem 0.375rem;
        border-radius: 9999px;
        font-size: 0.6875rem;
        font-weight: 600;

        &.badge-primary {
          background-color: var(--color-primary-subtle);
          color: var(--color-primary);
        }

        &.badge-success {
          background-color: var(--color-success-subtle);
          color: var(--color-success);
        }
      }

      .sidebar-footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid var(--color-border-subtle);
        background-color: var(--color-bg-subtle);
      }

      .runtime-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .env-dot {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        background-color: var(--color-success);
      }

      .env-text {
        font-size: 0.75rem;
        color: var(--color-text-muted);
        font-weight: 500;
      }
    `,
  ],
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();

  navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      route: '/dashboard',
      exact: true,
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
    },
    {
      id: 'demo-projects',
      label: 'Portfolio (Demo)',
      route: '/demo',
      badge: 'Live',
      badgeVariant: 'success',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
    },
  ];

  onLinkClick(): void {
    this.closeSidebar.emit();
  }
}
