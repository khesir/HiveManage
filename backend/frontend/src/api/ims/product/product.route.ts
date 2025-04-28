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
import productRecordRoute from './productRecord/productRecord.route';
import serialproductRoute from './serializeItems/serialize.route';
import productSuppplierRoute from './productSupplier/productSupplier.route';
import damageRecordRoute from './damageRecord/damageRecord.route';

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
  [
    multerbase.single('img_url'),
    formDataToObject,
    validateRequest({ body: UpdateProduct }),
    validateProductID,
  ],
  productController.updateProduct.bind(productController),
);

productRoute.delete(
  '/:product_id',
  validateProductID,
  productController.deleteProduct.bind(productController),
);

productRoute.use(
  '/:product_id/productRecord',
  validateProductID,
  productRecordRoute,
);

productRoute.use(
  '/:product_id/serializeRecord',
  validateProductID,
  serialproductRoute,
);

productRoute.use(
  '/:product_id/productSupplier',
  validateProductID,
  productSuppplierRoute,
);

productRoute.get(
  '/:product_id/damage_record',
  validateProductID,
  damageRecordRoute,
);
export default productRoute;
