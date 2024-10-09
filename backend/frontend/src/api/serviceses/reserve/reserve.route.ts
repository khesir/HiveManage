import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { ReserveController } from './reserve.controller';
import { validateReserveID } from './reserve.middleware';
import { CreateReserve, UpdateReserve } from './reserve.model';

const reserveRoute = Router({ mergeParams: true });
const reserveController = new ReserveController(db);

reserveRoute.get('/', reserveController.getAllReserve.bind(reserveController));
log.info('GET /reserve set');

reserveRoute.get(
  '/:reserve_id',
  validateReserveID,
  reserveController.getReserveById.bind(reserveController),
);
log.info('GET /reserve/:reserve_id set');

reserveRoute.post(
  '/',
  [validateRequest({ body: CreateReserve })],
  reserveController.createReserve.bind(reserveController),
);
log.info('POST /reserve/ set ');

reserveRoute.put(
  '/:reserve_id',
  [validateRequest({ body: UpdateReserve }), validateReserveID],
  reserveController.updateReserve.bind(reserveController),
);
log.info('PUT /reserve/:reserve_id set ');

reserveRoute.delete(
  '/:reserve_id',
  validateReserveID,
  reserveController.deleteReserve.bind(reserveController),
);
log.info('DELETE /reserve/:reserve_id set');

export default reserveRoute;
