import { UserRole } from '@core/auth/models/auth-user.model';

export interface NavItem {
  id: string;
  label: string;
  route: string;
  icon: string;
  badge?: string;
  badgeVariant?: 'primary' | 'success' | 'warning' | 'info';
  roles?: UserRole[];
  exact?: boolean;
}
