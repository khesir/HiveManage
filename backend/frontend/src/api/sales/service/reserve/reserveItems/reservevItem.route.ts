import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { ReserveItemController } from './reservevItem.controller';
import { validateReserveItemID } from './reservevItem.middleware';
import { CreateReserveItem, UpdateReserveItem } from './reservevItem.model';

const reserveitemsRoute = Router({ mergeParams: true });
const reserveitemsController = new ReserveItemController(db);

reserveitemsRoute.get(
  '/',
  reserveitemsController.getAllReserveItem.bind(reserveitemsController),
);

reserveitemsRoute.get(
  '/:reserve_item_id',
  validateReserveItemID,
  reserveitemsController.getReserveItemById.bind(reserveitemsController),
);

reserveitemsRoute.post(
  '/',
  [validateRequest({ body: CreateReserveItem })],
  reserveitemsController.createReserveItem.bind(reserveitemsController),
);

reserveitemsRoute.put(
  '/:reserve_item_id',
  [validateRequest({ body: UpdateReserveItem }), validateReserveItemID],
  reserveitemsController.updateReserveItem.bind(reserveitemsController),
);

reserveitemsRoute.delete(
  '/:reserve_item_id',
  validateReserveItemID,
  reserveitemsController.deleteReserveItem.bind(reserveitemsController),
);

export default reserveitemsRoute;
