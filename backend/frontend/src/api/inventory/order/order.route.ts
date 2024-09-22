import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/mysql/mysql.pool';
import log from '@/lib/logger';
import { OrderController } from './order.controller';
import { validateOrderId } from './order.middleware';
import { CreateOrder, UpdateOrder } from './order.model';

const orderRoute = Router({ mergeParams: true });
const orderController = new OrderController(db);

orderRoute.get('/', orderController.getAllOrders.bind(orderController));
log.info('GET /Order set');

orderRoute.get(
  '/:order_id',
  validateOrderId,
  orderController.getOrderById.bind(orderController),
);
log.info('GET /order/:order_id set');

orderRoute.post(
  '/',
  [validateRequest({ body: CreateOrder })],
  orderController.createOrder.bind(orderController),
);
log.info('POST /order/ set ');

orderRoute.put(
  '/:order_id',
  [validateRequest({ body: UpdateOrder }), validateOrderId],
  orderController.updateOrder.bind(orderController),
);
log.info('PUT /order/:order_id set ');

orderRoute.delete(
  '/:order_id',
  validateOrderId,
  orderController.deleteOrderById.bind(orderController),
);
log.info('DELETE /order/:order_id set');

export default orderRoute;
