import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { ProductTransactionLogController } from './PTL.controller';
import { CreateProductTransactionLog } from './PTL.model';

const productlogRoute = Router({ mergeParams: true });
const prodcuttranslogController = new ProductTransactionLogController(db);

productlogRoute.get(
  '/',
  prodcuttranslogController.getAllOrderTransactionLog.bind(
    prodcuttranslogController,
  ),
);

productlogRoute.post(
  '/',
  [validateRequest({ body: CreateProductTransactionLog })],
  prodcuttranslogController.createProductTransactionLog.bind(
    prodcuttranslogController,
  ),
);

export default productlogRoute;
