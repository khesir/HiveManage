import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { RemarkTicketsController } from './remarkticket.controller';
import { CreateRemarkTickets, UpdateRemarkTickets } from './remarkticket.model';
import { validateRemarkTicketsID } from './remarkticket.middleware';

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

export default remarkTicketsRoute;
