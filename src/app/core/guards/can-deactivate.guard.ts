import { CanDeactivateFn } from '@angular/router';
import { Observable } from 'rxjs';

export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean | Observable<boolean> | Promise<boolean>;
}

export const canDeactivateGuard: CanDeactivateFn<HasUnsavedChanges> = (component) => {
  if (component && typeof component.hasUnsavedChanges === 'function') {
    const hasChanges = component.hasUnsavedChanges();
    if (typeof hasChanges === 'boolean') {
      if (hasChanges) {
        return window.confirm('You have unsaved changes. Are you sure you want to navigate away?');
      }
      return true;
    }
    return hasChanges;
  }
  return true;
};
