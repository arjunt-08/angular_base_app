import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { ToastContainerComponent } from '@shared/ui/toast/toast.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    ToastContainerComponent,
  ],
  template: `
    <div class="shell-layout">
      <!-- Mobile Backdrop -->
      @if (sidebarOpen()) {
        <div class="sidebar-backdrop" (click)="closeSidebar()" role="presentation"></div>
      }

      <!-- Sidebar -->
      <app-sidebar [isOpen]="sidebarOpen()" (closeSidebar)="closeSidebar()"></app-sidebar>

      <!-- Main App Content Area -->
      <div class="shell-content">
        <app-header (toggleSidebar)="toggleSidebar()"></app-header>

        <main class="shell-main">
          <router-outlet></router-outlet>
        </main>

        <app-footer></app-footer>
      </div>

      <!-- Global Live Toast Notifications -->
      <app-toast-container></app-toast-container>
    </div>
  `,
  styles: [
    `
      .shell-layout {
        display: flex;
        min-height: 100vh;
        background-color: var(--color-bg-base);
      }

      .sidebar-backdrop {
        position: fixed;
        inset: 0;
        background-color: rgba(15, 23, 42, 0.5);
        backdrop-filter: blur(2px);
        z-index: 104;

        @media (min-width: 1024px) {
          display: none;
        }
      }

      .shell-content {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        min-width: 0;
      }

      .shell-main {
        flex: 1 1 auto;
        padding: 1.5rem;
        max-width: 1400px;
        width: 100%;
        margin: 0 auto;

        @media (min-width: 768px) {
          padding: 2rem;
        }
      }
    `,
  ],
})
export class ShellComponent {
  readonly sidebarOpen = signal(false);

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
