import { Job } from 'bull';
import { EventLogger } from '../../services/audit/eventLogger';
import { logger } from '../../utils/logger';

export async function processAudit(job: Job) {
  const { userId, eventType, data } = job.data;
  
  try {
    logger.info('Processing audit log', { jobId: job.id, userId, eventType });
    
    const eventLogger = EventLogger.getInstance();
    await eventLogger.logEvent({
      type: eventType,
      userId,
      data
    });
    
    return true;
  } catch (error) {
    logger.error('Audit processing failed', {
      jobId: job.id,
      error: error.message
    });
    throw error;
  }
}