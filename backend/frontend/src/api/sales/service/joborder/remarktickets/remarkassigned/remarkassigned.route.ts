import { Router } from 'express';
import { db } from '@/drizzle/pool';
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

remarkassignedRoute.get(
  '/:job_order_id',
  validateRemarkAssignedID,
  remarkassignedController.getRemarkAssignedById.bind(remarkassignedController),
);

remarkassignedRoute.post(
  '/',
  [validateRequest({ body: CreateRemarkAssigned })],
  remarkassignedController.createRemarkAssigned.bind(remarkassignedController),
);

remarkassignedRoute.put(
  '/:job_order_id',
  [validateRequest({ body: UpdateRemarkAssigned }), validateRemarkAssignedID],
  remarkassignedController.updateRemarkAssigned.bind(remarkassignedController),
);

remarkassignedRoute.delete(
  '/:job_order_id',
  validateRemarkAssignedID,
  remarkassignedController.deleteRemarkAssigned.bind(remarkassignedController),
);

export default remarkassignedRoute;
