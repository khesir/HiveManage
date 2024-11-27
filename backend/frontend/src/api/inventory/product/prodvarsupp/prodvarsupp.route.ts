import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { ProductVariantSupplierController } from './prodvarsupp.controller';
import { validateProductVariantSupplierID } from './prodvarsupp.middleware';
import {
  CreateProductVariantSupplier,
  UpdateProductVariantSupplier,
} from './prodvarsupp.model';

const productvarsuppRoute = Router({ mergeParams: true });
const productvarsuppController = new ProductVariantSupplierController(db);

productvarsuppRoute.get(
  '/',
  productvarsuppController.getAllProductVariantSupplier.bind(
    productvarsuppController,
  ),
);

productvarsuppRoute.get(
  '/:prdvariantsupp_id',
  validateProductVariantSupplierID,
  productvarsuppController.getProductVariantSupplierById.bind(
    productvarsuppController,
  ),
);

productvarsuppRoute.post(
  '/',
  [validateRequest({ body: CreateProductVariantSupplier })],
  productvarsuppController.createProductVariantSupplier.bind(
    productvarsuppController,
  ),
);

productvarsuppRoute.put(
  '/:prdvariantsupp_id',
  [
    validateRequest({ body: UpdateProductVariantSupplier }),
    validateProductVariantSupplierID,
  ],
  productvarsuppController.updateProductVariantSupplier.bind(
    productvarsuppController,
  ),
);

productvarsuppRoute.delete(
  '/:prdvariantsupp_id',
  validateProductVariantSupplierID,
  productvarsuppController.deleteProductVariantSupplier.bind(
    productvarsuppController,
  ),
);

export default productvarsuppRoute;
