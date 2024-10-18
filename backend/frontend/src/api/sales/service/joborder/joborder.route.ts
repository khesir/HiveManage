import { Router } from 'express';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { validateRequest } from '@/src/middlewares';
import { JobOrderController } from './joborder.controller';
import { validateJobOrderID } from './joborder.middleware';
import { CreateJobOrder, UpdateJobOrder } from './joborder.model';
import reportsRoute from './reports/reports.route';
import assignedEmployeeRoute from './assignedemployees/assignedemployees.route';
import remarkTicketsRoute from './remarktickets/remarkticket.route';

const joborderRoute = Router({ mergeParams: true });
const joborderController = new JobOrderController(db);

joborderRoute.get(
  '/',
  joborderController.getAllJobOrder.bind(joborderController),
);
log.info('GET /joborder set');

joborderRoute.get(
  '/:job_order_id',
  validateJobOrderID,
  joborderController.getJobOrderById.bind(joborderController),
);
log.info('GET /joborder/:job_order_id set');

joborderRoute.post(
  '/',
  [validateRequest({ body: CreateJobOrder })],
  joborderController.createJobOrder.bind(joborderController),
);
log.info('POST /joborder/ set ');

joborderRoute.put(
  '/:job_order_id',
  [validateRequest({ body: UpdateJobOrder }), validateJobOrderID],
  joborderController.updateJobOrder.bind(joborderController),
);
log.info('PUT /joborder/:job_order_id set ');

joborderRoute.delete(
  '/:job_order_id',
  validateJobOrderID,
  joborderController.deleteJobOrder.bind(joborderController),
);
log.info('DELETE /joborder/:job_order_id set');

joborderRoute.use('/:job_order_id/reports', validateJobOrderID, reportsRoute);
log.info('ROUTE Job order reports set');

joborderRoute.use(
  '/:job_order_id/assigned-employee',
  validateJobOrderID,
  assignedEmployeeRoute,
);
log.info('ROUTE Job order assigned employee set');

joborderRoute.use(
  '/:job_order_id/remark-tickets',
  validateJobOrderID,
  remarkTicketsRoute,
);
log.info('ROUTE Job order reports set');

export default joborderRoute;
