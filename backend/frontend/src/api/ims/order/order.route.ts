import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { formDataToObject, validateOrderId } from './order.middleware';
import { CreateOrder, UpdateOrder } from './order.model';
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
  [validateOrderId],
  orderController.finalize.bind(orderController),
);

orderRoute.post(
  '/:order_id/pushToInventory',
  [validateOrderId],
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

// orderRoute.post(
//   '/:order_id',
//   [validateOrderId, multerbase.single('img_url')],
//   orderController.updateOrder.bind(orderController),
// );

orderRoute.patch(
  '/:order_id/upload-receipt',
  [multerbase.single('img_url'), formDataToObject, validateOrderId],
  orderController.uploadDeliveryReceipt.bind(orderController),
);

orderRoute.use('/:order_id/order-product', validateOrderId, orderitemsRoute);

export default orderRoute;
