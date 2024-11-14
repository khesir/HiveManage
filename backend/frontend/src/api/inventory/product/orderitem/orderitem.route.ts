import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { OrderItemsController } from './orderitem.controller';
import { validateOrderItemID } from './orderitem.middleware';
import { CreateOrderItem, UpdateOrderItem } from './orderitem.model';

const orderitemsRoute = Router({ mergeParams: true });
const orderitemsController = new OrderItemsController(db);

orderitemsRoute.get(
  '/',
  orderitemsController.getAllOrderItem.bind(orderitemsController),
);
log.info('GET /item set');

orderitemsRoute.get(
  '/:item_id',
  validateOrderItemID,
  orderitemsController.getOrderItemById.bind(orderitemsController),
);
log.info('GET /item/:item_id set');

orderitemsRoute.post(
  '/',
  [validateRequest({ body: CreateOrderItem })],
  orderitemsController.createOrderItem.bind(orderitemsController),
);
log.info('POST /item/ set ');

orderitemsRoute.put(
  '/:item_id',
  [validateRequest({ body: UpdateOrderItem }), validateOrderItemID],
  orderitemsController.updateOrderItem.bind(orderitemsController),
);
log.info('PUT /item/:item_id set ');

orderitemsRoute.delete(
  '/:item_id',
  validateOrderItemID,
  orderitemsController.deleteOrderItem.bind(orderitemsController),
);
log.info('DELETE /item/:item_id set');

export default orderitemsRoute;
