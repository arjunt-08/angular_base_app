import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@design-system/themes/theme.service';
import { AuthService } from '@core/auth/services/auth.service';
import { BreadcrumbsComponent, BreadcrumbItem } from '@shared/ui/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, BreadcrumbsComponent],
  template: `
    <header class="app-header">
      <div class="header-left">
        <button
          type="button"
          class="menu-toggle-btn"
          (click)="onToggleSidebar()"
          aria-label="Toggle navigation menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <div class="header-breadcrumbs">
          <app-breadcrumbs [items]="breadcrumbs"></app-breadcrumbs>
        </div>
      </div>

      <div class="header-right">
        <!-- Theme Switcher -->
        <button
          type="button"
          class="action-icon-btn"
          (click)="onToggleTheme()"
          [title]="
            'Switch to ' + (themeService.currentTheme() === 'light' ? 'Dark' : 'Light') + ' Mode'
          "
          aria-label="Toggle color theme"
        >
          @if (themeService.currentTheme() === 'light') {
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          } @else {
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          }
        </button>

        <!-- User Profile Pill -->
        @if (authService.currentUser(); as user) {
          <div class="user-profile">
            <div class="user-avatar" aria-hidden="true">
              {{ user.name.charAt(0) }}
            </div>
            <div class="user-info">
              <span class="user-name">{{ user.name }}</span>
              <span class="user-role">{{ user.roles[0] || 'User' }}</span>
            </div>
            <button
              type="button"
              class="logout-btn"
              (click)="onLogout()"
              title="Sign out of enterprise account"
              aria-label="Sign out"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        }
      </div>
    </header>
  `,
  styles: [
    `
      .app-header {
        height: 4rem;
        padding: 0 1.5rem;
        background-color: var(--color-bg-surface);
        border-bottom: 1px solid var(--color-border-subtle);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        position: sticky;
        top: 0;
        z-index: 100;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .menu-toggle-btn {
        color: var(--color-text-secondary);
        padding: 0.5rem;
        border-radius: 0.375rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 150ms ease;

        &:hover {
          background-color: var(--color-bg-muted);
          color: var(--color-text-primary);
        }

        @media (min-width: 1024px) {
          display: none;
        }
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .action-icon-btn {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-secondary);
        border: 1px solid var(--color-border-subtle);
        background-color: var(--color-bg-surface);
        transition: all 150ms ease;

        &:hover {
          background-color: var(--color-bg-muted);
          color: var(--color-text-primary);
          border-color: var(--color-border-base);
        }
      }

      .user-profile {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        padding: 0.25rem 0.625rem 0.25rem 0.25rem;
        border-radius: 9999px;
        background-color: var(--color-bg-subtle);
        border: 1px solid var(--color-border-subtle);
      }

      .user-avatar {
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background-color: var(--color-primary);
        color: var(--color-primary-contrast);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.8125rem;
      }

      .user-info {
        display: flex;
        flex-direction: column;
        line-height: 1.2;

        @media (max-width: 640px) {
          display: none;
        }
      }

      .user-name {
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--color-text-primary);
      }

      .user-role {
        font-size: 0.6875rem;
        color: var(--color-text-muted);
        text-transform: capitalize;
      }

      .logout-btn {
        margin-left: 0.375rem;
        padding: 0.25rem;
        border-radius: 0.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-muted);
        transition: all 150ms ease;

        &:hover {
          color: var(--color-danger);
          background-color: var(--color-danger-subtle);
        }
      }
    `,
  ],
})
export class HeaderComponent {
  readonly themeService = inject(ThemeService);
  readonly authService = inject(AuthService);

  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', url: '/dashboard' },
    { label: 'Enterprise Starter' },
  ];

  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  onToggleTheme(): void {
    this.themeService.toggleTheme();
  }

  onLogout(): void {
    this.authService.logout('/login');
  }
}
