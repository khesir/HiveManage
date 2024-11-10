import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { RemarkTicketsController } from './remarkticket.controller';
import { CreateRemarkTickets, UpdateRemarkTickets } from './remarkticket.model';
import { validateRemarkTicketsID } from './remarkticket.middleware';
import remarkItemsRoute from './remarkitems/remarkitems.route';
import remarkReportsRoute from './remarkreports/remarkreports.route';
import remarkassignedRoute from './remarkassigned/remarkassigned.route';
import remarkContentRoute from './remarkcontent/remarkcontent.route';
import reportsRoute from './reports/reports.route';

const remarkTicketsRoute = Router({ mergeParams: true });
const remarkTicketsController = new RemarkTicketsController(db);

remarkTicketsRoute.get(
  '/',
  remarkTicketsController.getAllRemarkTickets.bind(remarkTicketsController),
);

remarkTicketsRoute.get(
  '/:remark_id',
  validateRemarkTicketsID,
  remarkTicketsController.getRemarkTicketsById.bind(remarkTicketsController),
);

remarkTicketsRoute.post(
  '/',
  [validateRequest({ body: CreateRemarkTickets })],
  remarkTicketsController.createRemarkTickets.bind(remarkTicketsController),
);

remarkTicketsRoute.put(
  '/:remark_id',
  [validateRequest({ body: UpdateRemarkTickets }), validateRemarkTicketsID],
  remarkTicketsController.updateRemarkTickets.bind(remarkTicketsController),
);

remarkTicketsRoute.delete(
  '/:remark_id',
  validateRemarkTicketsID,
  remarkTicketsController.deleteRemarkTickets.bind(remarkTicketsController),
);

remarkTicketsRoute.use(
  '/:remark_id/remark-items',
  validateRemarkTicketsID,
  remarkItemsRoute,
);

remarkTicketsRoute.use(
  '/:remark_id/remark-reports',
  validateRemarkTicketsID,
  remarkReportsRoute,
);

remarkTicketsRoute.use(
  '/:remark_id/remark-assigned',
  validateRemarkTicketsID,
  remarkassignedRoute,
);

remarkTicketsRoute.use(
  '/:remark_id/remark-content',
  validateRemarkTicketsID,
  remarkContentRoute,
);

remarkTicketsRoute.use(
  '/:job_order_id/reports',
  validateRemarkTicketsID,
  reportsRoute,
);

export default remarkTicketsRoute;
