import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { ReserveController } from './reserve.controller';
import { validateReserveID } from './reserve.middleware';
import { CreateReserve, UpdateReserve } from './reserve.model';
import reserveitemsRoute from './reserveItems/reservevItem.route';

const reserveRoute = Router({ mergeParams: true });
const reserveController = new ReserveController(db);

reserveRoute.get('/', reserveController.getAllReserve.bind(reserveController));

reserveRoute.get(
  '/:reserve_id',
  validateReserveID,
  reserveController.getReserveById.bind(reserveController),
);

reserveRoute.post(
  '/',
  [validateRequest({ body: CreateReserve })],
  reserveController.createReserve.bind(reserveController),
);

reserveRoute.put(
  '/:reserve_id',
  [validateRequest({ body: UpdateReserve }), validateReserveID],
  reserveController.updateReserve.bind(reserveController),
);

reserveRoute.delete(
  '/:reserve_id',
  validateReserveID,
  reserveController.deleteReserve.bind(reserveController),
);

reserveRoute.use(
  '/:reserve_id/reserveitems',
  validateReserveID,
  reserveitemsRoute,
);

export default reserveRoute;
