import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
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

productcategoryRoute.get(
  '/:product_category_id',
  validateProductCategoryID,
  productcategoryController.getProductCategoryById.bind(
    productcategoryController,
  ),
);

productcategoryRoute.post(
  '/',
  [validateRequest({ body: CreateProductCategory })],
  productcategoryController.createProductCategory.bind(
    productcategoryController,
  ),
);

productcategoryRoute.put(
  '/:product_category_id',
  [validateRequest({ body: UpdateProductCategory }), validateProductCategoryID],
  productcategoryController.updateProductCategory.bind(
    productcategoryController,
  ),
);

productcategoryRoute.delete(
  '/:product_category_id',
  validateProductCategoryID,
  productcategoryController.deleteProductCategory.bind(
    productcategoryController,
  ),
);

export default productcategoryRoute;
