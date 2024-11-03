import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { RemarkTicketsController } from './remarkticket.controller';
import { CreateRemarkTickets, UpdateRemarkTickets } from './remarkticket.model';
import { validateRemarkTicketsID } from './remarkticket.middleware';
import remarkItemsRoute from './remarkitems/remarkitem.route';
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
log.info('GET /remarktickets set');

remarkTicketsRoute.get(
  '/:remark_id',
  validateRemarkTicketsID,
  remarkTicketsController.getRemarkTicketsById.bind(remarkTicketsController),
);
log.info('GET /remarktickets/:remark_id set');

remarkTicketsRoute.post(
  '/',
  [validateRequest({ body: CreateRemarkTickets })],
  remarkTicketsController.createRemarkTickets.bind(remarkTicketsController),
);
log.info('POST /remarktickets/ set ');

remarkTicketsRoute.put(
  '/:remark_id',
  [validateRequest({ body: UpdateRemarkTickets }), validateRemarkTicketsID],
  remarkTicketsController.updateRemarkTickets.bind(remarkTicketsController),
);
log.info('PUT /remarktickets/:remark_id set ');

remarkTicketsRoute.delete(
  '/:remark_id',
  validateRemarkTicketsID,
  remarkTicketsController.deleteRemarkTickets.bind(remarkTicketsController),
);
log.info('DELETE /remarktickets/:remark_id set');

remarkTicketsRoute.use(
  '/:remark_id/remark-items',
  validateRemarkTicketsID,
  remarkItemsRoute,
);
log.info('ROUTE Job order remark items set');

remarkTicketsRoute.use(
  '/:remark_id/remark-reports',
  validateRemarkTicketsID,
  remarkReportsRoute,
);
log.info('ROUTE Job order remark reports set');

remarkTicketsRoute.use(
  '/:remark_id/remark-assigned',
  validateRemarkTicketsID,
  remarkassignedRoute,
);
log.info('ROUTE Job order remark assigned set');

remarkTicketsRoute.use(
  '/:remark_id/remark-content',
  validateRemarkTicketsID,
  remarkContentRoute,
);
log.info('ROUTE Job order remark content set');

remarkTicketsRoute.use(
  '/:job_order_id/reports',
  validateRemarkTicketsID,
  reportsRoute,
);
log.info('ROUTE Job order reports set');

export default remarkTicketsRoute;
