import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { JobOrderItemsController } from './joborderitem.controller';
import { validateJobOrderItemsID } from './joborderitem.middleware';
import { CreateJobOrderItems, UpdateJobOrderItems } from './joborderitem.model';

const joborderItemsRoute = Router({ mergeParams: true });
const joborderItemsController = new JobOrderItemsController(db);

joborderItemsRoute.get(
  '/',
  joborderItemsController.getAllJobOrderItems.bind(joborderItemsController),
);
log.info('GET /joborderitems set');

joborderItemsRoute.get(
  '/:joborderitems_id',
  validateJobOrderItemsID,
  joborderItemsController.getJobOrderItemsById.bind(joborderItemsController),
);
log.info('GET /joborderitems/:joborderitems_id set');

joborderItemsRoute.post(
  '/',
  [validateRequest({ body: CreateJobOrderItems })],
  joborderItemsController.createJobOrderItems.bind(joborderItemsController),
);
log.info('POST /joborderitems/ set ');

joborderItemsRoute.put(
  '/:joborderitems_id',
  [validateRequest({ body: UpdateJobOrderItems }), validateJobOrderItemsID],
  joborderItemsController.updateJobOrderItems.bind(joborderItemsController),
);
log.info('PUT /joborderitems/:joborderitems_id set ');

joborderItemsRoute.delete(
  '/:joborderitems_id',
  validateJobOrderItemsID,
  joborderItemsController.deleteJobOrderItems.bind(joborderItemsController),
);
log.info('DELETE /joborderitems/:joborderitems_id set');

export default joborderItemsRoute;
