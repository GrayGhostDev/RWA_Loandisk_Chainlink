import { Job } from 'bull';
import { NotificationService } from '../../services/business/notificationService';
import { logger } from '../../utils/logger';

export async function processNotification(job: Job) {
  const { userId, type, data, channels } = job.data;
  
  try {
    logger.info('Processing notification', { jobId: job.id, userId, type });
    
    const notificationService = new NotificationService();
    await notificationService.sendNotification(userId, type, data, channels);
    
    return true;
  } catch (error) {
    logger.error('Notification processing failed', {
      jobId: job.id,
      error: error.message
    });
    throw error;
  }
}