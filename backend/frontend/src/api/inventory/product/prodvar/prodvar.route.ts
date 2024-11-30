import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { ProductVariantController } from './prodvar.controller';
import {
  formDataToObject,
  multerbase,
  validateProductVariantID,
} from './prodvar.middleware';
import { CreateProductVariant, UpdateProductVariant } from './prodvar.model';

const productvariantRoute = Router({ mergeParams: true });
const productvariantController = new ProductVariantController(db);

productvariantRoute.get(
  '/',
  productvariantController.getAllProductVariant.bind(productvariantController),
);

productvariantRoute.get(
  '/:variant_id',
  validateProductVariantID,
  productvariantController.getProductVariantById.bind(productvariantController),
);

productvariantRoute.post(
  '/',
  [
    multerbase.single('img_url'),
    formDataToObject,
    validateRequest({ body: CreateProductVariant }),
  ],
  productvariantController.createProductVariant.bind(productvariantController),
);

productvariantRoute.put(
  '/:variant_id',
  [validateRequest({ body: UpdateProductVariant }), validateProductVariantID],
  productvariantController.updateProductVariant.bind(productvariantController),
);

productvariantRoute.delete(
  '/:variant_id',
  validateProductVariantID,
  productvariantController.deleteProductVariant.bind(productvariantController),
);

export default productvariantRoute;
