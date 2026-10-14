import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoginComponent } from './login.component';
import { AuthService } from '@core/auth/services/auth.service';
import { NotificationService } from '@core/notification/notification.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: { login: ReturnType<typeof vi.fn> };
  let mockNotificationService: { success: ReturnType<typeof vi.fn> };
  let router: Router;

  beforeEach(async () => {
    mockAuthService = {
      login: vi.fn(),
    };
    mockNotificationService = {
      success: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: mockAuthService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockImplementation(() => Promise.resolve(true));
    fixture.detectChanges();
  });

  it('should create login component with default demo credentials', () => {
    expect(component).toBeTruthy();
    expect(component.form.valid).toBe(true);
    expect(component.form.value.email).toBe('architect@enterprise.org');
  });

  it('should mark form invalid if email is improperly formatted', () => {
    component.form.patchValue({ email: 'invalid-email' });
    expect(component.form.get('email')?.invalid).toBe(true);
  });

  it('should log in and navigate to destination upon form submission', async () => {
    component.onSubmit();
    expect(component.loading()).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 450));

    expect(mockAuthService.login).toHaveBeenCalledWith(
      expect.objectContaining({ accessToken: 'mock_jwt_enterprise_token' }),
      expect.objectContaining({ email: 'architect@enterprise.org' }),
    );
    expect(mockNotificationService.success).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });
});
