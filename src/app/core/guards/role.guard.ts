import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { UserRole } from '../auth/models/auth-user.model';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = (route.data?.['roles'] as UserRole[] | undefined) ?? [];

  if (requiredRoles.length === 0 || authService.hasAnyRole(requiredRoles)) {
    return true;
  }

  // Not authorized - redirect to dashboard or forbidden page
  return router.createUrlTree(['/dashboard']);
};
