import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/notification/notification.service';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { TextInputComponent } from '@shared/ui/text-input/text-input.component';
import { CardComponent } from '@shared/ui/card/card.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, TextInputComponent, CardComponent],
  template: `
    <div class="login-wrapper">
      <div class="login-card-container">
        <div class="login-brand">
          <div class="brand-logo" aria-hidden="true">
            <svg
              width="28"
              height="28"
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
          <h1 class="brand-name">ApexCore Enterprise</h1>
          <p class="brand-subtitle">Sign in to your enterprise workstation</p>
        </div>

        <app-card>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="login-form">
            <app-text-input
              formControlName="email"
              type="email"
              label="Enterprise Email"
              placeholder="architect@enterprise.org"
              [required]="true"
              [error]="
                form.get('email')?.touched && form.get('email')?.invalid
                  ? 'Valid enterprise email required'
                  : null
              "
            ></app-text-input>

            <app-text-input
              formControlName="password"
              type="password"
              label="Password"
              placeholder="••••••••••••"
              [required]="true"
              [error]="
                form.get('password')?.touched && form.get('password')?.invalid
                  ? 'Password required'
                  : null
              "
            ></app-text-input>

            <div class="demo-account-hint">
              <span class="hint-label">Demo Credentials:</span>
              <button type="button" class="hint-btn" (click)="fillDemoCredentials()">
                Fill Architect Credentials
              </button>
            </div>

            <div class="form-actions">
              <app-button
                variant="primary"
                type="submit"
                [fullWidth]="true"
                size="lg"
                [loading]="loading()"
                [disabled]="form.invalid"
              >
                Sign In
              </app-button>
            </div>
          </form>
        </app-card>

        <p class="login-footer">
          Clean Architecture &bull; Angular Signals &bull; Enterprise Starter
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .login-wrapper {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        background: radial-gradient(
          circle at 50% 20%,
          var(--color-primary-subtle) 0%,
          var(--color-bg-base) 70%
        );
      }

      .login-card-container {
        width: 100%;
        max-width: 26rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .login-brand {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .brand-logo {
        width: 3.5rem;
        height: 3.5rem;
        border-radius: 0.75rem;
        background: linear-gradient(135deg, var(--color-primary) 0%, #a855f7 100%);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 1rem;
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.35);
      }

      .brand-name {
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--color-text-primary);
        margin: 0 0 0.25rem 0;
        letter-spacing: -0.02em;
      }

      .brand-subtitle {
        font-size: 0.875rem;
        color: var(--color-text-muted);
        margin: 0;
      }

      .login-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .demo-account-hint {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        font-size: 0.75rem;
        padding: 0.5rem 0.75rem;
        background-color: var(--color-bg-subtle);
        border: 1px solid var(--color-border-subtle);
        border-radius: 0.375rem;
      }

      .hint-label {
        color: var(--color-text-muted);
      }

      .hint-btn {
        color: var(--color-primary);
        font-weight: 600;
        cursor: pointer;
        text-decoration: underline;

        &:hover {
          color: var(--color-primary-hover);
        }
      }

      .form-actions {
        margin-top: 0.5rem;
      }

      .login-footer {
        text-align: center;
        font-size: 0.75rem;
        color: var(--color-text-muted);
        margin: 0;
      }
    `,
  ],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notifications = inject(NotificationService);

  readonly loading = signal(false);

  readonly form: FormGroup = this.fb.group({
    email: ['architect@enterprise.org', [Validators.required, Validators.email]],
    password: ['Password123!', [Validators.required, Validators.minLength(6)]],
  });

  fillDemoCredentials(): void {
    this.form.patchValue({
      email: 'architect@enterprise.org',
      password: 'Password123!',
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    setTimeout(() => {
      const email = this.form.value.email;
      this.authService.login(
        { accessToken: 'mock_jwt_enterprise_token' },
        {
          id: 'usr_enterprise_01',
          email,
          name: email.split('@')[0].toUpperCase(),
          roles: ['admin', 'manager'],
        },
      );

      this.notifications.success('Welcome back to ApexCore!', 'Authenticated');
      this.loading.set(false);

      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
      this.router.navigateByUrl(returnUrl);
    }, 400);
  }
}
