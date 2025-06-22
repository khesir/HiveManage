import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { SalesController } from './sales.controller';
import { validateSalesID } from './sales.middleware';
import { CreateSales, UpdateSales } from './sales.model';
import salesitemRoute from './salesItem/salesItem.route';

const salesRoute = Router({ mergeParams: true });
const salesController = new SalesController(db);

salesRoute.get('/', salesController.getAllSales.bind(salesController));

salesRoute.get(
  '/:sales_id',
  validateSalesID,
  salesController.getSalesById.bind(salesController),
);

salesRoute.post(
  '/',
  [validateRequest({ body: CreateSales })],
  salesController.createSales.bind(salesController),
);

salesRoute.put(
  '/:sales_id',
  [validateRequest({ body: UpdateSales }), validateSalesID],
  salesController.updateSales.bind(salesController),
);

salesRoute.delete(
  '/:sales_id',
  validateSalesID,
  salesController.deleteSales.bind(salesController),
);

salesRoute.use('/:sales_id/sales_items', validateSalesID, salesitemRoute);
export default salesRoute;
