import { Injectable, signal } from '@angular/core';
import { NotificationMessage, NotificationType } from './notification.model';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly defaultDurationMs = 5000;
  private messageCounter = 0;

  readonly notifications = signal<NotificationMessage[]>([]);

  show(type: NotificationType, message: string, title?: string, durationMs?: number): string {
    const id = `notify_${Date.now()}_${++this.messageCounter}`;
    const notification: NotificationMessage = {
      id,
      type,
      message,
      title,
      durationMs: durationMs ?? this.defaultDurationMs,
    };

    this.notifications.update((list) => [...list, notification]);

    if (notification.durationMs && notification.durationMs > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, notification.durationMs);
    }

    return id;
  }

  success(message: string, title?: string, durationMs?: number): string {
    return this.show('success', message, title, durationMs);
  }

  error(message: string, title?: string, durationMs?: number): string {
    return this.show('error', message, title, durationMs);
  }

  warning(message: string, title?: string, durationMs?: number): string {
    return this.show('warning', message, title, durationMs);
  }

  info(message: string, title?: string, durationMs?: number): string {
    return this.show('info', message, title, durationMs);
  }

  dismiss(id: string): void {
    this.notifications.update((list) => list.filter((n) => n.id !== id));
  }

  clearAll(): void {
    this.notifications.set([]);
  }
}
