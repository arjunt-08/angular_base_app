import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusBadge',
  standalone: true,
})
export class StatusBadgePipe implements PipeTransform {
  transform(status: string | null | undefined): {
    label: string;
    variant: 'success' | 'warning' | 'info' | 'danger' | 'neutral';
  } {
    if (!status) {
      return { label: 'Unknown', variant: 'neutral' };
    }

    const s = status.toLowerCase();
    switch (s) {
      case 'active':
      case 'completed':
      case 'published':
      case 'success':
        return { label: status, variant: 'success' };
      case 'planning':
      case 'pending':
      case 'in_progress':
        return { label: status, variant: 'warning' };
      case 'review':
      case 'info':
        return { label: status, variant: 'info' };
      case 'archived':
      case 'inactive':
      case 'draft':
        return { label: status, variant: 'neutral' };
      case 'failed':
      case 'critical':
      case 'cancelled':
        return { label: status, variant: 'danger' };
      default:
        return { label: status, variant: 'neutral' };
    }
  }
}
