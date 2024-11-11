import Bull from 'bull';
import { config } from '../config';
import { processTransaction } from './processors/transaction';
import { processNotification } from './processors/notification';
import { processAudit } from './processors/audit';

export const transactionQueue = new Bull('transactions', {
  redis: config.redis.url,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  }
});

export const notificationQueue = new Bull('notifications', {
  redis: config.redis.url,
  defaultJobOptions: {
    attempts: 2,
    backoff: {
      type: 'fixed',
      delay: 1000
    }
  }
});

export const auditQueue = new Bull('audit', {
  redis: config.redis.url
});

// Process jobs
transactionQueue.process(processTransaction);
notificationQueue.process(processNotification);
auditQueue.process(processAudit);

// Error handling
const queues = [transactionQueue, notificationQueue, auditQueue];
queues.forEach(queue => {
  queue.on('error', error => {
    console.error(`Queue ${queue.name} error:`, error);
  });

  queue.on('failed', (job, error) => {
    console.error(`Job ${job.id} in ${queue.name} failed:`, error);
  });
});