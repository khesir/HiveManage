import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { RemarkTicketsController } from './remarkticket.controller';
import { CreateRemarkTickets, UpdateRemarkTickets } from './remarkticket.model';
import { validateRemarkTicketsID } from './remarkticket.middleware';
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
  '/:remark_id/reports',
  validateRemarkTicketsID,
  reportsRoute,
);

export default remarkTicketsRoute;
