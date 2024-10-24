import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { ProductAttachmentController } from './productattachment.controller';
import { validateProductAttachmentID } from './productattachment.middleware';
import {
  CreateProductAttachment,
  UpdateProductAttachment,
} from './productattachment.model';

const productattachmentRoute = Router({ mergeParams: true });
const productattachmentController = new ProductAttachmentController(db);

productattachmentRoute.get(
  '/',
  productattachmentController.getAllProductAttachment.bind(
    productattachmentController,
  ),
);
log.info('GET /product set');

productattachmentRoute.get(
  '/:product_id',
  validateProductAttachmentID,
  productattachmentController.getProductAttachmentById.bind(
    productattachmentController,
  ),
);
log.info('GET /product/:product_id set');

productattachmentRoute.post(
  '/',
  [validateRequest({ body: CreateProductAttachment })],
  productattachmentController.createProductAttachment.bind(
    productattachmentController,
  ),
);
log.info('POST /product/ set ');

productattachmentRoute.put(
  '/:product_id',
  [
    validateRequest({ body: UpdateProductAttachment }),
    validateProductAttachmentID,
  ],
  productattachmentController.updateProductAttachment.bind(
    productattachmentController,
  ),
);
log.info('PUT /product/:product_id set ');

productattachmentRoute.delete(
  '/:product_id',
  validateProductAttachmentID,
  productattachmentController.deleteProductAttachment.bind(
    productattachmentController,
  ),
);
log.info('DELETE /product/:product_id set');

export default productattachmentRoute;
