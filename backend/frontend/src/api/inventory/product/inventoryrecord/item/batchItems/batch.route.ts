import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';
import { CreateBatch } from './batch.model';
import { BatchController } from './batch.controller';
import { validateBatchID } from './batch.middleware';

const batchRoute = Router({ mergeParams: true });
const batchController = new BatchController(db);

batchRoute.get('/', batchController.getAllBatch.bind(batchController));
batchRoute.get(
  '/:batch_id',
  validateBatchID,
  batchController.getBatchById.bind(batchController),
);
batchRoute.post(
  '/',
  [validateRequest({ body: CreateBatch })],
  batchController.createBatch.bind(batchController),
);
batchRoute.put(
  '/:batch_id',
  [validateRequest({ body: CreateBatch })],
  batchController.updateBatch.bind(batchController),
);
batchRoute.delete(
  '/:batch_id',
  validateBatchID,
  batchController.deleteBatch.bind(batchController),
);

export default batchRoute;
