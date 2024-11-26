import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { ProductController } from './product.controller';
import {
  formDataToObject,
  multerbase,
  validateProductID,
} from './product.middleware';
import { CreateProduct, UpdateProduct } from './product.model';
import productcategoryRoute from './productcategory/productcategory.route';
import inventoryRecordRoute from './inventoryrecord/itemrecord.route';
import stockLogsRoute from '../stocksLogs/stockslogs.route';
import productvariantRoute from './prodvar/prodvar.route';
import productvarsuppRoute from './prodvarsupp/prodvarsupp.route';

const productRoute = Router({ mergeParams: true });
const productController = new ProductController(db);

productRoute.get('/', productController.getAllProduct.bind(productController));

productRoute.get(
  '/:product_id',
  validateProductID,
  productController.getProductById.bind(productController),
);

productRoute.post(
  '/',
  [
    multerbase.single('img_url'),
    formDataToObject,
    validateRequest({ body: CreateProduct }),
  ],
  productController.createProduct.bind(productController),
);

productRoute.put(
  '/:product_id',
  [validateRequest({ body: UpdateProduct }), validateProductID],
  productController.updateProduct.bind(productController),
);

productRoute.delete(
  '/:product_id',
  validateProductID,
  productController.deleteProduct.bind(productController),
);

productRoute.use(
  '/:product_id/productcategory',
  validateProductID,
  productcategoryRoute,
);

productRoute.use(
  '/:product_id/item-record',
  validateProductID,
  inventoryRecordRoute,
);

productRoute.use('/:product_id/stock-logs', validateProductID, stockLogsRoute);

productRoute.use(
  '/:product_id/variant',
  validateProductID,
  productvariantRoute,
);

productRoute.use(
  '/:product_id/prodvarsupp',
  validateProductID,
  productvarsuppRoute,
);

export default productRoute;
