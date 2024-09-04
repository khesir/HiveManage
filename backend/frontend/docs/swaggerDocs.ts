import swaggerUi from 'swagger-ui-express';

import { Express, Request, Response } from 'express';
import combineSwaggerDocs from './combineOpenApi';
import path from 'path';
import log from '../lib/logger';
const docsDir = path.join(__dirname, './api');
const swaggerDocument = combineSwaggerDocs(docsDir);
log.info('Documentation is loaded');

async function swaggerDocs(app: Express) {
  // Swagger UI
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Swagger JSON
  app.get('/docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  });
}

export default swaggerDocs;
