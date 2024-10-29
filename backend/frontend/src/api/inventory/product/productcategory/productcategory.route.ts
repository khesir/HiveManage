import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { ProductCategoryController } from './productcategory.controller';
import { validateProductCategoryID } from './productcategory.middleware';
import {
  CreateProductCategory,
  UpdateProductCategory,
} from './productcategory.model';

const productcategoryRoute = Router({ mergeParams: true });
const productcategoryController = new ProductCategoryController(db);

productcategoryRoute.get(
  '/',
  productcategoryController.getAllProductCategory.bind(
    productcategoryController,
  ),
);
log.info('GET /productcategory set');

productcategoryRoute.get(
  '/:product_category_id',
  validateProductCategoryID,
  productcategoryController.getProductCategoryById.bind(
    productcategoryController,
  ),
);
log.info('GET /productcategory/:product_category_id set');

productcategoryRoute.post(
  '/',
  [validateRequest({ body: CreateProductCategory })],
  productcategoryController.createProductCategory.bind(
    productcategoryController,
  ),
);
log.info('POST /productcategory/ set ');

productcategoryRoute.put(
  '/:product_category_id',
  [validateRequest({ body: UpdateProductCategory }), validateProductCategoryID],
  productcategoryController.updateProductCategory.bind(
    productcategoryController,
  ),
);
log.info('PUT /productcategory/:product_category_id set ');

productcategoryRoute.delete(
  '/:product_category_id',
  validateProductCategoryID,
  productcategoryController.deleteProductCategory.bind(
    productcategoryController,
  ),
);
log.info('DELETE /productcategory/:product_category_id set');

export default productcategoryRoute;
