import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { ArriveItemsController } from './arriveItem.controller';
import { validateArriveItemsID } from './arriveItem.middleware';
import { CreateArriveItems, UpdateArriveItems } from './arriveItem.model';

const arriveitemsRoute = Router({ mergeParams: true });
const arriveitemsController = new ArriveItemsController(db);

arriveitemsRoute.get(
  '/',
  arriveitemsController.getAllArriveItems.bind(arriveitemsController),
);
log.info('GET /arriveItems set');

arriveitemsRoute.get(
  '/:arrive_items_id',
  validateArriveItemsID,
  arriveitemsController.getArriveItemsById.bind(arriveitemsController),
);
log.info('GET /arriveItems/:arrive_items_id set');

arriveitemsRoute.post(
  '/',
  [validateRequest({ body: CreateArriveItems })],
  arriveitemsController.createArriveItems.bind(arriveitemsController),
);
log.info('POST /arriveItems/ set ');

arriveitemsRoute.put(
  '/:arrive_items_id',
  [validateRequest({ body: UpdateArriveItems }), validateArriveItemsID],
  arriveitemsController.updateArriveItems.bind(arriveitemsController),
);
log.info('PUT /arriveItems/:arrive_items_id set ');

arriveitemsRoute.delete(
  '/:arrive_items_id',
  validateArriveItemsID,
  arriveitemsController.deleteArriveItems.bind(arriveitemsController),
);
log.info('DELETE /arriveItems/:arrive_items_id set');

export default arriveitemsRoute;
