export type NotificationType =
  | 'TRANSACTION_CREATED'
  | 'TRANSACTION_COMPLETED'
  | 'TRANSACTION_FAILED'
  | 'KYC_REQUIRED'
  | 'SECURITY_ALERT'
  | 'ACCOUNT_UPDATE';

export type NotificationChannel = 'email' | 'sms' | 'in_app';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
}