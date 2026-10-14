import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="breadcrumbs-nav" aria-label="Breadcrumb">
      <ol class="breadcrumbs-list">
        @for (item of items; track item.label; let last = $last) {
          <li class="breadcrumbs-item" [class.is-current]="last">
            @if (!last && item.url) {
              <a [routerLink]="item.url" class="breadcrumbs-link">{{ item.label }}</a>
              <span class="breadcrumbs-separator" aria-hidden="true">/</span>
            } @else {
              <span class="breadcrumbs-current" [attr.aria-current]="last ? 'page' : null">
                {{ item.label }}
              </span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: [
    `
      .breadcrumbs-nav {
        font-size: 0.8125rem;
      }

      .breadcrumbs-list {
        display: flex;
        align-items: center;
        list-style: none;
        padding: 0;
        margin: 0;
        flex-wrap: wrap;
      }

      .breadcrumbs-item {
        display: inline-flex;
        align-items: center;
      }

      .breadcrumbs-link {
        color: var(--color-text-muted);
        transition: color 150ms ease;

        &:hover {
          color: var(--color-primary);
        }
      }

      .breadcrumbs-separator {
        margin: 0 0.5rem;
        color: var(--color-border-strong);
      }

      .breadcrumbs-current {
        color: var(--color-text-primary);
        font-weight: 500;
      }
    `,
  ],
})
export class BreadcrumbsComponent {
  @Input() items: BreadcrumbItem[] = [];
}
