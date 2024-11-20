import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { OrderItemTracking } from './orderitemtracking.controller';
import { validateOrderItemId } from './orderitemtracking.middleware';

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
  validateOrderItemId,
  orderItemTracking.updateOrderItemTracking.bind(orderItemTracking),
);
orderTrackingRoute.delete(
  '/:order_item_id',
  validateOrderItemId,
  orderItemTracking.updateOrderItemTracking.bind(orderItemTracking),
);

export default orderTrackingRoute;
