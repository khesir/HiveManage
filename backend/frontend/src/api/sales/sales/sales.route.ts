import { Router } from 'express';
import { db } from '../../../../mysql/mysql.pool';
import log from '../../../../lib/logger';
import { SalesController } from './sales.controller';
import { CreateSales, UpdateSales } from './sales.model';
import { validateSalesID } from './sales.middleware';
import { validateRequest } from '../../../../src/middlewares';

const salesRoute = Router({ mergeParams: true });
const salesController = new SalesController(db);

salesRoute.get('/', salesController.getAllSales.bind(salesController));
log.info('GET /sales set');

salesRoute.get(
  '/:sales_id',
  validateSalesID,
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

export default salesRoute;
