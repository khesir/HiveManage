import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';
import { JoborderController } from './joborder.controller';
import { validateJoborderID } from './joborder.middleware';
import { CreateJoborder, UpdateJoborder } from './joborder.model';
import serviceRoute from './services/service.route';

const jobrderRoute = Router({ mergeParams: true });
const joborderController = new JoborderController(db);

jobrderRoute.get(
  '/',
  joborderController.getAlljobrder.bind(joborderController),
);

jobrderRoute.get(
  '/:joborder_id',
  validateJoborderID,
  joborderController.getJoborderById.bind(joborderController),
);

jobrderRoute.post(
  '/',
  [validateRequest({ body: CreateJoborder })],
  joborderController.createJoborder.bind(joborderController),
);

jobrderRoute.put(
  '/:joborder_id',
  [validateRequest({ body: UpdateJoborder }), validateJoborderID],
  joborderController.updateJoborder.bind(joborderController),
);

jobrderRoute.delete(
  '/:joborder_id',
  validateJoborderID,
  joborderController.deleteJoborder.bind(joborderController),
);

jobrderRoute.post(
  '/:joborder_id/payment',
  validateJoborderID,
  joborderController.payment.bind(joborderController),
);

jobrderRoute.use('/:joborder_id/service', validateJoborderID, serviceRoute);

export default jobrderRoute;
