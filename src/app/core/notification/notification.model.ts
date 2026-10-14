export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface NotificationMessage {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  durationMs?: number;
}
