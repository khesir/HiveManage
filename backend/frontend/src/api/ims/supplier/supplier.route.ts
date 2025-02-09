import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { SupplierController } from './supplier.controller';
import {
  formDataToObject,
  multerbase,
  validateSupplierID,
} from './supplier.middleware';
import { CreateSupplier, UpdateSupplier } from './supplier.model';

const supplierRoute = Router({ mergeParams: true });
const supplierController = new SupplierController(db);

supplierRoute.get(
  '/',
  supplierController.getAllSupplier.bind(supplierController),
);

supplierRoute.get(
  '/:supplier_id',
  validateSupplierID,
  supplierController.getSupplierById.bind(supplierController),
);

supplierRoute.post(
  '/',
  [
    multerbase.single('profile_link'),
    formDataToObject,
    validateRequest({ body: CreateSupplier }),
  ],
  supplierController.createSupplier.bind(supplierController),
);

supplierRoute.put(
  '/:supplier_id',
  [validateRequest({ body: UpdateSupplier }), validateSupplierID],
  supplierController.updateSupplier.bind(supplierController),
);

supplierRoute.delete(
  '/:supplier_id',
  validateSupplierID,
  supplierController.deleteSupplierById.bind(supplierController),
);

export default supplierRoute;
