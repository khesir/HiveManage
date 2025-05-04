import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { OrderTransactionLogController } from './OTL.controller';
import { CreateOrderTransactionLog } from './OTL.model';

const orderlogRoute = Router({ mergeParams: true });
const ordertranslogController = new OrderTransactionLogController(db);

orderlogRoute.get(
  '/',
  ordertranslogController.getAllOrderTransactionLog.bind(
    ordertranslogController,
  ),
);

orderlogRoute.post(
  '/',
  [validateRequest({ body: CreateOrderTransactionLog })],
  ordertranslogController.createOrderTransactionLog.bind(
    ordertranslogController,
  ),
);

export default orderlogRoute;
