import express from 'express';
import ip from 'ip';
import dotenv from 'dotenv';
import cors from 'cors';

import { HttpStatus } from '../lib/config';
import log from '../lib/logger';
import baseRoute from './app.route';

dotenv.config();
async function bootstrap() {
  const PORT = process.env.SERVER_PORT || 3000;
  const app = express();

  app.use(cors({ origin: '*' }));
  app.use(express.json());

  app.use('/api', baseRoute);

  app.all('*', (req, res) => res.status(HttpStatus.NOT_FOUND.code));

  app.listen(PORT, () => {
    const url =
      process.env.NODE_ENV === 'dev'
        ? `localhost:${PORT}`
        : `${ip.address()}:${PORT}`;

    log.info(`Server Running: ${url}`);
    log.info(`Docs available at : ${url}/api/docs`);
  });
}
bootstrap();
