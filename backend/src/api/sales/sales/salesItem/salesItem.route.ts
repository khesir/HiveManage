import { Router } from 'express';
import { db } from '@/drizzle/pool';
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

salesitemRoute.get(
  '/:sales_item_id',
  validateSalesItemID,
  salesitemController.getSalesItemById.bind(salesitemController),
);

salesitemRoute.post(
  '/',
  [validateRequest({ body: CreateSalesItem })],
  salesitemController.createSalesItem.bind(salesitemController),
);

salesitemRoute.put(
  '/:sales_item_id',
  [validateRequest({ body: UpdateSalesItem }), validateSalesItemID],
  salesitemController.updateSalesItem.bind(salesitemController),
);

salesitemRoute.delete(
  '/:sales_item_id',
  validateSalesItemID,
  salesitemController.deleteSalesItem.bind(salesitemController),
);
salesitemRoute.put(
  '/:sales_item_id/return',
  [validateRequest({ body: UpdateSalesItem }), validateSalesItemID],
  salesitemController.returnSalesItem.bind(salesitemController),
);
export default salesitemRoute;
