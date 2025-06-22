import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { OrderItemsController } from './orderitem.controller';
import { validateOrderItemID } from './orderitem.middleware';
import { CreateOrderItem, UpdateOrderItem } from './orderitem.model';
import log from '@/lib/logger';
import orderlogRoute from './OrderTransLogs/OTL.route';

const orderitemsRoute = Router({ mergeParams: true });
const orderitemsController = new OrderItemsController(db);

orderitemsRoute.get(
  '/',
  orderitemsController.getAllOrderItem.bind(orderitemsController),
);

orderitemsRoute.get(
  '/:order_item_id',
  validateOrderItemID,
  orderitemsController.getOrderItemById.bind(orderitemsController),
);

orderitemsRoute.post(
  '/',
  [validateRequest({ body: CreateOrderItem })],
  orderitemsController.createOrderItem.bind(orderitemsController),
);

orderitemsRoute.put(
  '/:order_item_id',
  [validateRequest({ body: UpdateOrderItem }), validateOrderItemID],
  orderitemsController.updateOrderItem.bind(orderitemsController),
);

orderitemsRoute.delete(
  '/:order_item_id',
  validateOrderItemID,
  orderitemsController.deleteOrderItem.bind(orderitemsController),
);
orderitemsRoute.post(
  '/:order_item_id/delivery',
  [validateRequest({ body: UpdateOrderItem }), validateOrderItemID],
  orderitemsController.addDelivery.bind(orderitemsController),
);
orderitemsRoute.post(
  '/:order_item_id/resolve',
  [validateRequest({ body: UpdateOrderItem }), validateOrderItemID],
  orderitemsController.addResolve.bind(orderitemsController),
);

orderitemsRoute.use(
  '/:order_item_id/orderlogs',
  validateOrderItemID,
  orderlogRoute,
);
log.info('ROUTE order logs set');

export default orderitemsRoute;
