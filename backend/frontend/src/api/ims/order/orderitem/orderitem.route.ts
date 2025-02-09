import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { OrderItemsController } from './orderitem.controller';
import { validateOrderItemID } from './orderitem.middleware';
import {
  CreateOrderItem,
  UpdateOrderItem,
  UpdateStatus,
} from './orderitem.model';
import orderTrackingRoute from './orderItemTracking/orderitemtracking.route';

const orderitemsRoute = Router({ mergeParams: true });
const orderitemsController = new OrderItemsController(db);

orderitemsRoute.get(
  '/',
  orderitemsController.getAllOrderItem.bind(orderitemsController),
);

orderitemsRoute.get(
  '/:orderItem_id',
  validateOrderItemID,
  orderitemsController.getOrderItemById.bind(orderitemsController),
);

orderitemsRoute.post(
  '/',
  [validateRequest({ body: CreateOrderItem })],
  orderitemsController.createOrderItem.bind(orderitemsController),
);

orderitemsRoute.put(
  '/:orderItem_id',
  [validateRequest({ body: UpdateOrderItem }), validateOrderItemID],
  orderitemsController.updateOrderItem.bind(orderitemsController),
);

orderitemsRoute.delete(
  '/:orderItem_id',
  validateOrderItemID,
  orderitemsController.deleteOrderItem.bind(orderitemsController),
);

orderitemsRoute.post(
  '/:orderItem_id/update_status',
  [validateOrderItemID, validateRequest({ body: UpdateStatus })],
  orderitemsController.updateStatus.bind(orderitemsController),
);

orderitemsRoute.use(
  '/:orderItem_id/tracking',
  validateOrderItemID,
  orderTrackingRoute,
);

export default orderitemsRoute;
