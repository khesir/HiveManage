import { Router } from 'express';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { SalesController } from './sales.controller';
import { CreateSales, UpdateSales } from './sales.model';
import { validateSalesID } from './sales.middleware';
import { validateRequest } from '@/src/middlewares';
import paymentRoute from './payment/payment.route';
import receiptRoute from './receipt/receipt.route';

const salesRoute = Router({ mergeParams: true });
const salesController = new SalesController(db);

salesRoute.get('/', salesController.getAllSales.bind(salesController));
log.info('GET /sales set');

salesRoute.get(
  '/:sales_id',
  [validateSalesID],
  salesController.getSalesById.bind(salesController),
);
log.info('GET /sales/:sales_id set');

salesRoute.post(
  '/',
  [validateRequest({ body: CreateSales })],
  salesController.createSales.bind(salesController),
);
log.info('POST /sales/ set ');

salesRoute.put(
  '/:sales_id',
  [validateRequest({ body: UpdateSales }), validateSalesID],
  salesController.updateSales.bind(salesController),
);
log.info('PUT /sales/:sales_id set ');

salesRoute.delete(
  '/:sales_id',
  validateSalesID,
  salesController.deleteSales.bind(salesController),
);
log.info('DELETE /sales/:sales_id set');

salesRoute.use('/:sales_id/payment', validateSalesID, paymentRoute);
log.info('ROUTE Sales payment set');

salesRoute.use('/:sales_id/receipt', validateSalesID, receiptRoute);
log.info('ROUTE Sales Receipt set');

export default salesRoute;
