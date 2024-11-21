import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { OrderItemTracking } from './orderitemtracking.controller';
import { validateOrderItemId } from './orderitemtracking.middleware';
import { validateRequest } from '@/src/middlewares';
import { updateOrderTrackingSchema } from './orderitemtracking.model';
import { CreateInventoryRecord } from '../../../product/inventoryrecord/inventoryrecord.model';

const orderTrackingRoute = Router({ mergeParams: true });
const orderItemTracking = new OrderItemTracking(db);

orderTrackingRoute.get(
  '/',
  orderItemTracking.getAllOrderItemTracking.bind(orderItemTracking),
);
orderTrackingRoute.post(
  '/',
  orderItemTracking.createOrderItemTracking.bind(orderItemTracking),
);
orderTrackingRoute.put(
  '/:order_item_id',
  [validateOrderItemId, validateRequest({ body: updateOrderTrackingSchema })],
  orderItemTracking.updateOrderItemTracking.bind(orderItemTracking),
);
orderTrackingRoute.delete(
  '/:order_item_id',
  [validateOrderItemId],
  orderItemTracking.deleteOrderItemTracking.bind(orderItemTracking),
);

orderTrackingRoute.post(
  '/:order_item_id/stock-in',
  [validateOrderItemId, validateRequest({ body: CreateInventoryRecord })],
  orderItemTracking.stockIn.bind(orderItemTracking),
);

export default orderTrackingRoute;
