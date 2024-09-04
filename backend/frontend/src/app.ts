import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import baseRoute from './api';
import * as middlewares from './middlewares';
import MessageResponse from './interfaces/MessageResponse';
import log from '../lib/logger';
import swaggerDocs from '../docs/swaggerDocs';

dotenv.config();
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

swaggerDocs(app);

app.use('/api/v1', baseRoute);
log.info('Api base route set');

app.get<object, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'All systems working on root',
  });
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
