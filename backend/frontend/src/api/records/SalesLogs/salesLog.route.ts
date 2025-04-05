import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { SalesLogController } from './salesLog.controller';
import { CreateSalesLog } from './salesLog.model';

const saleslogRoute = Router({ mergeParams: true });
const saleslogController = new SalesLogController(db);

saleslogRoute.get('/', saleslogController.getSalesLog.bind(saleslogController));

saleslogRoute.post(
  '/',
  [validateRequest({ body: CreateSalesLog })],
  saleslogController.createSalesLog.bind(saleslogController),
);

export default saleslogRoute;
