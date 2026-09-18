import { Logger } from '@config/logger.config';
import axios from 'axios';
import cron from 'node-cron';

const logger = new Logger('KEEP_ALIVE');

export function startKeepAlive(serverUrl: string) {
  if (!serverUrl || serverUrl.includes('localhost') || serverUrl.includes('127.0.0.1')) {
    return;
  }

  logger.info(`Self-ping Keep-Alive cron job active for ${serverUrl} (Every 10 mins).`);

  // Run every 10 minutes to prevent Render from going to sleep
  cron.schedule('*/10 * * * *', async () => {
    try {
      await axios.get(serverUrl);
      logger.info(`Keep-Alive ping successful: ${serverUrl}`);
    } catch (error: any) {
      logger.error(`Keep-Alive ping error: ${error?.message || error}`);
    }
  });
}
