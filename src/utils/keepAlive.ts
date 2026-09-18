import { Logger } from '@config/logger.config';
import axios from 'axios';
import cron from 'node-cron';

const logger = new Logger('KEEP_ALIVE');

export function startKeepAlive(serverUrl: string) {
  if (!serverUrl || serverUrl.includes('localhost') || serverUrl.includes('127.0.0.1')) {
    return;
  }

  // Normalize URL format
  let targetUrl = serverUrl.trim();
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = `https://${targetUrl}`;
  }

  logger.info(`Keep-Alive Cron active: Pinging ${targetUrl} every 5 minutes to prevent Render sleep.`);

  // Run every 5 minutes (well within Render's 15-minute idle sleep threshold)
  cron.schedule('*/5 * * * *', async () => {
    try {
      const response = await axios.get(targetUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Evolution-API-KeepAlive/1.0',
        },
      });
      logger.info(`Keep-Alive Ping OK [${response.status}]: ${targetUrl}`);
    } catch (error: any) {
      logger.error(`Keep-Alive Ping Warning: ${error?.message || error}`);
    }
  });
}
