import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { ProductRecordController } from './productRecord.controller';
import { validateProductRecordID } from './productRecord.middleware';
import {
  CreateProductRecord,
  UpdateProductRecord,
} from './productRecord.model';

const productRecordRoute = Router({ mergeParams: true });
const productRecordController = new ProductRecordController(db);

productRecordRoute.get(
  '/',
  productRecordController.getAllProductRecord.bind(productRecordController),
);

productRecordRoute.get(
  '/:product_record_id',
  validateProductRecordID,
  productRecordController.getProductRecordById.bind(productRecordController),
);

productRecordRoute.post(
  '/',
  [validateRequest({ body: CreateProductRecord })],
  productRecordController.createProductRecord.bind(productRecordController),
);

productRecordRoute.put(
  '/:product_record_id',
  [validateRequest({ body: UpdateProductRecord }), validateProductRecordID],
  productRecordController.updateProductRecord.bind(productRecordController),
);

productRecordRoute.delete(
  '/:product_record_id',
  validateProductRecordID,
  productRecordController.deleteProductRecord.bind(productRecordController),
);

productRecordRoute.use(
  '/:product_record_id/serializeItems',
  validateProductRecordID,
  productRecordRoute,
);

export default productRecordRoute;
