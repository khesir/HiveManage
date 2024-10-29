import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { SupplierItemController } from './supplieritem.controller';
import { validateSupplierItemID } from './supplieritem.middleware';
import { CreateSupplierItem, UpdateSupplierItem } from './supplieritem.model';

const supplierItemRoute = Router({ mergeParams: true });
const supplierItemController = new SupplierItemController(db);

supplierItemRoute.get(
  '/',
  supplierItemController.getAllSupplierItem.bind(supplierItemController),
);
log.info('GET /supplieritem set');

supplierItemRoute.get(
  '/:supplier_item_id',
  validateSupplierItemID,
  supplierItemController.getSupplierItemById.bind(supplierItemController),
);
log.info('GET /supplieritem/:supplier_item_id set');

supplierItemRoute.post(
  '/',
  [validateRequest({ body: CreateSupplierItem })],
  supplierItemController.createSupplierItem.bind(supplierItemController),
);
log.info('POST /supplieritem/ set ');

supplierItemRoute.put(
  '/:supplier_item_id',
  [validateRequest({ body: UpdateSupplierItem }), validateSupplierItemID],
  supplierItemController.updateSupplierItem.bind(supplierItemController),
);
log.info('PUT /supplieritem/:supplier_item_id set ');

supplierItemRoute.delete(
  '/:supplier_item_id',
  validateSupplierItemID,
  supplierItemController.deleteSupplierItem.bind(supplierItemController),
);
log.info('DELETE /supplieritem/:supplier_item_id set');

export default supplierItemRoute;
