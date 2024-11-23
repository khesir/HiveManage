import { Router } from 'express';
import { db } from '@/drizzle/pool';

import { ItemController } from './item.controller';
import { validateItemID } from './item.middleware';
import { CreateItem, UpdateItem } from './item.model';
import { validateRequest } from '@/src/middlewares';

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

export default itemRoute;
