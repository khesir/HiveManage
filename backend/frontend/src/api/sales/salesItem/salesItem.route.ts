import { Router } from 'express';
import log from '@/lib/logger';
import { db } from '@/mysql/mysql.pool';
import { validateRequest } from '@/src/middlewares';
import { SalesItemController } from './salesItem.controller';
import { validateSalesItemID } from './salesItem.middleware';
import { CreateSalesItem, UpdateSalesItem } from './salesItem.model';

const salesitemRoute = Router({ mergeParams: true });
const salesitemController = new SalesItemController(db);

salesitemRoute.get(
  '/',
  salesitemController.getAllSalesItem.bind(salesitemController),
);
log.info('GET /salesitem set');

salesitemRoute.get(
  '/:sales_item_id',
  validateSalesItemID,
  salesitemController.getSalesItemById.bind(salesitemController),
);
log.info('GET /salesitem/:sales_item_id set');

salesitemRoute.post(
  '/',
  [validateRequest({ body: CreateSalesItem })],
  salesitemController.createSalesItem.bind(salesitemController),
);
log.info('POST /salesitem/ set ');

salesitemRoute.put(
  '/:sales_item_id',
  [validateRequest({ body: UpdateSalesItem }), validateSalesItemID],
  salesitemController.updateSalesItem.bind(salesitemController),
);
log.info('PUT /salesitem/:sales_item_id set ');

salesitemRoute.delete(
  '/:sales_item_id',
  validateSalesItemID,
  salesitemController.deleteSalesItem.bind(salesitemController),
);
log.info('DELETE /salesitem/:sales_item_id set');

export default salesitemRoute;
