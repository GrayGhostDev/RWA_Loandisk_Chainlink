import { Job } from 'bull';
import { TransactionProcessor } from '../../services/transaction/processor';
import { NotificationService } from '../../services/business/notificationService';
import { logger } from '../../utils/logger';

export async function processTransaction(job: Job) {
  const { userId, type, amount } = job.data;
  
  try {
    logger.info('Processing transaction', { jobId: job.id, userId, type });
    
    const processor = new TransactionProcessor();
    const result = await processor.processTransaction(userId, amount, type);
    
    // Send notification
    const notificationService = new NotificationService();
    await notificationService.sendNotification(
      userId,
      'TRANSACTION_COMPLETED',
      { transactionId: result.id }
    );
    
    return result;
  } catch (error) {
    logger.error('Transaction processing failed', {
      jobId: job.id,
      error: error.message
    });
    throw error;
  }
}