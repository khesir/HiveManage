import { Router } from 'express';
import { db } from '@/drizzle/pool';

import { ItemController } from './item.controller';
import { validateItemID } from './item.middleware';
import { CreateItem, UpdateItem } from './item.model';
import { validateRequest } from '@/src/middlewares';
import serialRoute from './serializeItems/serialize.route';
import batchRoute from './batchItems/batch.route';

const itemRoute = Router({ mergeParams: true });
const itemController = new ItemController(db);

itemRoute.get('/', itemController.getAllItem.bind(itemController));
itemRoute.get(
  '/:item_id',
  validateItemID,
  itemController.getItemById.bind(itemController),
);
itemRoute.post(
  '/',
  [validateRequest({ body: CreateItem })],
  itemController.createItem.bind(itemController),
);
itemRoute.put(
  '/:item_id',
  [validateRequest({ body: UpdateItem })],
  itemController.updateItem.bind(itemController),
);
itemRoute.delete(
  '/:item_id',
  validateItemID,
  itemController.deleteItem.bind(itemController),
);

itemRoute.use('/:item_id/serialized', validateItemID, serialRoute);
itemRoute.use('/:item_id/batch', validateItemID, batchRoute);

export default itemRoute;
