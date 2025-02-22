import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';
import { JobOrderController } from './joborder.controller';
import { validateJobOrderID } from './joborder.middleware';
import { CreateJobOrder, UpdateJobOrder } from './joborder.model';
import reportsRoute from './remarktickets/reports/reports.route';
import assignedEmployeeRoute from './assignedemployees/assignedemployees.route';
import remarkTicketsRoute from './remarktickets/remarkticket.route';
import joborderitemRoute from './joborderitem/joborderitem.route';
import jobordertypesRoute from './jobordertypes/jobordertypes.route';

const joborderRoute = Router({ mergeParams: true });
const joborderController = new JobOrderController(db);

joborderRoute.get(
  '/',
  joborderController.getAllJobOrder.bind(joborderController),
);

joborderRoute.get(
  '/:job_order_id',
  validateJobOrderID,
  joborderController.getJobOrderById.bind(joborderController),
);

joborderRoute.post(
  '/',
  [validateRequest({ body: CreateJobOrder })],
  joborderController.createJobOrder.bind(joborderController),
);

joborderRoute.put(
  '/:job_order_id',
  [validateRequest({ body: UpdateJobOrder }), validateJobOrderID],
  joborderController.updateJobOrder.bind(joborderController),
);

joborderRoute.delete(
  '/:job_order_id',
  validateJobOrderID,
  joborderController.deleteJobOrder.bind(joborderController),
);

joborderRoute.use('/:job_order_id/reports', validateJobOrderID, reportsRoute);

joborderRoute.use(
  '/:job_order_id/assigned-employee',
  validateJobOrderID,
  assignedEmployeeRoute,
);

joborderRoute.use(
  '/:job_order_id/remark-tickets',
  validateJobOrderID,
  remarkTicketsRoute,
);

joborderRoute.use(
  '/:job_order_id/joborderitem',
  validateJobOrderID,
  joborderitemRoute,
);

joborderRoute.use(
  '/:job_order_id/remarktype',
  validateJobOrderID,
  joborderitemRoute,
);

joborderRoute.use(
  '/:job_order_id/jobordertypes',
  validateJobOrderID,
  jobordertypesRoute,
);

export default joborderRoute;
