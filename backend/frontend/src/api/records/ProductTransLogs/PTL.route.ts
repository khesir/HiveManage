import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { ProductTransactionLogController } from './PTL.controller';
import { CreateProductTransactionLog } from './PTL.model';

const producttranslogRoute = Router({ mergeParams: true });
const prodcuttranslogController = new ProductTransactionLogController(db);

producttranslogRoute.get(
  '/',
  prodcuttranslogController.getAllOrderTransactionLog.bind(
    prodcuttranslogController,
  ),
);

producttranslogRoute.post(
  '/',
  [validateRequest({ body: CreateProductTransactionLog })],
  prodcuttranslogController.createProductTransactionLog.bind(
    prodcuttranslogController,
  ),
);

export default producttranslogRoute;
