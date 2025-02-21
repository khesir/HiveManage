import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';
import { JobOrderItemController } from './joborderitem.controller';
import { validateJobOrderItemsID } from './joborderitem.middleware';
import { CreateJobOrderItems, UpdateJobOrderItems } from './joborderitem.model';

const joborderitemRoute = Router({ mergeParams: true });
const joborderitemController = new JobOrderItemController(db);

joborderitemRoute.get(
  '/',
  joborderitemController.getAllJobOrderItem.bind(joborderitemController),
);

joborderitemRoute.get(
  '/:job_order_item_id',
  validateJobOrderItemsID,
  joborderitemController.getJobOrderItemById.bind(joborderitemController),
);

joborderitemRoute.post(
  '/',
  [validateRequest({ body: CreateJobOrderItems })],
  joborderitemController.createJobOrderItem.bind(joborderitemController),
);

joborderitemRoute.put(
  '/:job_order_item_id',
  [validateRequest({ body: UpdateJobOrderItems }), validateJobOrderItemsID],
  joborderitemController.updateJobOrderItem.bind(joborderitemController),
);

joborderitemRoute.delete(
  '/:job_order_item_id',
  validateJobOrderItemsID,
  joborderitemController.deleteJobOrderItem.bind(joborderitemController),
);

export default joborderitemRoute;
