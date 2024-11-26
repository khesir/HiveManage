import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { ProductVariantController } from './prodvar.controller';
import { validateProductVariantID } from './prodvar.middleware';
import { CreateProductVariant, UpdateProductVariant } from './prodvar.model';

const productvariantRoute = Router({ mergeParams: true });
const productvariantController = new ProductVariantController(db);

productvariantRoute.get(
  '/',
  productvariantController.getAllProductVariant.bind(productvariantController),
);

productvariantRoute.get(
  '/:product_category_id',
  validateProductVariantID,
  productvariantController.getProductVariantById.bind(productvariantController),
);

productvariantRoute.post(
  '/',
  [validateRequest({ body: CreateProductVariant })],
  productvariantController.createProductVariant.bind(productvariantController),
);

productvariantRoute.put(
  '/:product_category_id',
  [validateRequest({ body: UpdateProductVariant }), validateProductVariantID],
  productvariantController.updateProductVariant.bind(productvariantController),
);

productvariantRoute.delete(
  '/:product_category_id',
  validateProductVariantID,
  productvariantController.deleteProductVariant.bind(productvariantController),
);

export default productvariantRoute;
