import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/mysql/mysql.pool';
import log from '@/lib/logger';
import { SupplierController } from './supplier.controller';
import { validateSupplierID } from './supplier.middleware';
import { CreateSupplier, UpdateSupplier } from './supplier.model';

const supplierRoute = Router({ mergeParams: true });
const supplierController = new SupplierController(db);

supplierRoute.get(
  '/',
  supplierController.getAllSupplier.bind(supplierController),
);
log.info('GET /Supplier set');

supplierRoute.get(
  '/:supplier_id',
  validateSupplierID,
  supplierController.getSupplierById.bind(supplierController),
);
log.info('GET /supplier/:supplier_id set');

supplierRoute.patch(
  '/',
  [validateRequest({ body: CreateSupplier })],
  supplierController.createSupplier.bind(supplierController),
);
log.info('POST /supplier/ set ');

supplierRoute.put(
  '/:supplier_id',
  [validateRequest({ body: UpdateSupplier }), validateSupplierID],
  supplierController.updateSupplier.bind(supplierController),
);
log.info('PUT /supplier/:supplier_id set ');

supplierRoute.delete(
  '/:supplier_id',
  validateSupplierID,
  supplierController.deleteSupplierById.bind(supplierController),
);
log.info('DELETE /supplier/:supplier_id set');

export default supplierRoute;
