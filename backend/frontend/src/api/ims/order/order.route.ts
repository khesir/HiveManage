import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { validateOrderId } from './order.middleware';
import { CreateOrder, FinalizeOrder, UpdateOrder } from './order.model';
import { OrderController } from './order.controller';
import orderitemsRoute from './orderitem/orderitem.route';
import { multerbase } from '../product/product.middleware';

const orderRoute = Router({ mergeParams: true });
const orderController = new OrderController(db);

orderRoute.get('/', orderController.getAllOrders.bind(orderController));

orderRoute.get(
  '/product',
  orderController.getOrdersByProductID.bind(orderController),
);

orderRoute.get(
  '/:order_id',
  validateOrderId,
  orderController.getOrderById.bind(orderController),
);

orderRoute.post(
  '/',
  [validateRequest({ body: CreateOrder })],
  orderController.createOrder.bind(orderController),
);

orderRoute.post(
  '/:order_id/finalize',
  [validateRequest({ body: FinalizeOrder })],
  orderController.finalize.bind(orderController),
);

orderRoute.post(
  '/:order_id/pushToInventory',
  [validateRequest({ body: UpdateOrder })],
  orderController.pushToInventory.bind(orderController),
);

orderRoute.put(
  '/:order_id',
  [validateRequest({ body: UpdateOrder }), validateOrderId],
  orderController.updateOrder.bind(orderController),
);

orderRoute.delete(
  '/:order_id',
  validateOrderId,
  orderController.deleteOrderById.bind(orderController),
);

orderRoute.post(
  '/:order_id',
  [validateOrderId, multerbase.single('img_url')],

  orderController.updateOrder.bind(orderController),
);

orderRoute.use('/:order_id/order-product', validateOrderId, orderitemsRoute);

export default orderRoute;
