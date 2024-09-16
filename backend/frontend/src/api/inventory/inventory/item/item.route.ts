import { Router } from 'express';
import { validateRequest } from '../../../../middlewares';
import { db } from '../../../../../mysql/mysql.pool';
import log from '../../../../../lib/logger';
import { ItemsController } from './item.controller';
import { validateItemID } from './item.middleware';
import { CreateItem, UpdateItem } from './item.model';

const itemsRoute = Router({ mergeParams: true });
const itemsController = new ItemsController(db);

itemsRoute.get('/', itemsController.getAllItem.bind(itemsController));
log.info('GET /item set');

itemsRoute.get(
  '/:item_id',
  validateItemID,
  itemsController.getItemById.bind(itemsController),
);
log.info('GET /item/:item_id set');

itemsRoute.post(
  '/',
  [validateRequest({ body: CreateItem })],
  itemsController.createItem.bind(itemsController),
);
log.info('POST /item/ set ');

itemsRoute.put(
  '/:item_id',
  [validateRequest({ body: UpdateItem }), validateItemID],
  itemsController.updateItem.bind(itemsController),
);
log.info('PUT /item/:item_id set ');

itemsRoute.delete(
  '/:item_id',
  validateItemID,
  itemsController.deleteItem.bind(itemsController),
);
log.info('DELETE /item/:item_id set');

export default itemsRoute;
