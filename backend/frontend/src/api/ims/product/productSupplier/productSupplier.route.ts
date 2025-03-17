import { Router } from 'express';
import { ProductSupplierController } from './productSupplier.controller';
import { db } from '@/drizzle/pool';
import { validateProductSupplierID } from './productSupplier.middleware';
import { validateRequest } from '@/src/middlewares';
import { CreateProductSupplier } from './productSupplier.model';

const productSuppplierRoute = Router({ mergeParams: true });
const productSupplierController = new ProductSupplierController(db);

productSuppplierRoute.get(
  '/',
  productSupplierController.getAllProductSupplier.bind(
    productSupplierController,
  ),
);

// productSuppplierRoute.get(
//   '/:product_supplier_id',
//   validateProductSupplierID,
//   productSupplierController.getProductSupplierById.bind(
//     productSupplierController,
//   ),
// );

productSuppplierRoute.post(
  '/',
  [validateRequest({ body: CreateProductSupplier })],
  productSupplierController.createProductSupplier.bind(
    productSupplierController,
  ),
);

// productSuppplierRoute.put(
//   '/:product_supplier_id',
//   [validateRequest({ body: UpdateProductSupplier }), validateProductSupplierID],
//   productSupplierController.updateProductSupplier.bind(
//     productSupplierController,
//   ),
// );

productSuppplierRoute.delete(
  '/:product_supplier_id',
  validateProductSupplierID,
  productSupplierController.deleteProductSupplier.bind(
    productSupplierController,
  ),
);

export default productSuppplierRoute;
