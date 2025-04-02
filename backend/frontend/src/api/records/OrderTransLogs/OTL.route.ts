import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { OrderTransactionLogController } from './OTL.controller';
import { CreateOrderTransactionLog } from './OTL.model';

const ordertranslogRoute = Router({ mergeParams: true });
const ordertranslogController = new OrderTransactionLogController(db);

ordertranslogRoute.get(
  '/',
  ordertranslogController.getAllOrderTransactionLog.bind(
    ordertranslogController,
  ),
);

ordertranslogRoute.post(
  '/',
  [validateRequest({ body: CreateOrderTransactionLog })],
  ordertranslogController.createOrderTransactionLog.bind(
    ordertranslogController,
  ),
);

export default ordertranslogRoute;
