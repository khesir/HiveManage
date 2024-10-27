import { Router } from 'express';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { validateRequest } from '@/src/middlewares';
import { RemarkAssignedController } from './remarkassigned.controller';
import { validateRemarkAssignedID } from './remarkassigned.middleware';
import {
  CreateRemarkAssigned,
  UpdateRemarkAssigned,
} from './remarkassigned.model';

const remarkassignedRoute = Router({ mergeParams: true });
const remarkassignedController = new RemarkAssignedController(db);

remarkassignedRoute.get(
  '/',
  remarkassignedController.getAllRemarkAssigned.bind(remarkassignedController),
);
log.info('GET /joborder set');

remarkassignedRoute.get(
  '/:job_order_id',
  validateRemarkAssignedID,
  remarkassignedController.getRemarkAssignedById.bind(remarkassignedController),
);
log.info('GET /joborder/:job_order_id set');

remarkassignedRoute.post(
  '/',
  [validateRequest({ body: CreateRemarkAssigned })],
  remarkassignedController.createRemarkAssigned.bind(remarkassignedController),
);
log.info('POST /joborder/ set ');

remarkassignedRoute.put(
  '/:job_order_id',
  [validateRequest({ body: UpdateRemarkAssigned }), validateRemarkAssignedID],
  remarkassignedController.updateRemarkAssigned.bind(remarkassignedController),
);
log.info('PUT /joborder/:job_order_id set ');

remarkassignedRoute.delete(
  '/:job_order_id',
  validateRemarkAssignedID,
  remarkassignedController.deleteRemarkAssigned.bind(remarkassignedController),
);
log.info('DELETE /joborder/:job_order_id set');

export default remarkassignedRoute;
