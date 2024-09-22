import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/mysql/mysql.pool';
import log from '@/lib/logger';
import { ProductController } from './product.controller';
import { validateProductID } from './product.middleware';
import { CreateProduct, UpdateProduct } from './product.model';

const productRoute = Router({ mergeParams: true });
const productController = new ProductController(db);

productRoute.get('/', productController.getAllProduct.bind(productController));
log.info('GET /product set');

productRoute.get(
  '/:product_id',
  validateProductID,
  productController.getProductById.bind(productController),
);
log.info('GET /product/:product_id set');

productRoute.post(
  '/',
  [validateRequest({ body: CreateProduct })],
  productController.createProduct.bind(productController),
);
log.info('POST /product/ set ');

productRoute.put(
  '/:product_id',
  [validateRequest({ body: UpdateProduct }), validateProductID],
  productController.updateProduct.bind(productController),
);
log.info('PUT /product/:product_id set ');

productRoute.delete(
  '/:product_id',
  validateProductID,
  productController.deleteProduct.bind(productController),
);
log.info('DELETE /product/:product_id set');

export default productRoute;
