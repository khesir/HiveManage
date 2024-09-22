import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/mysql/mysql.pool';
import log from '@/lib/logger';
import { ReceiptController } from './receipt.controller';
import { validateReceiptID } from './receipt.middleware';
import { CreateReceipt, UpdateReceipt } from './receipt.model';

const receiptRoute = Router({ mergeParams: true });
const receiptController = new ReceiptController(db);

receiptRoute.get('/', receiptController.getAllReceipt.bind(receiptController));
log.info('GET /category set');

receiptRoute.get(
  '/:receipt_id',
  validateReceiptID,
  receiptController.getReceiptById.bind(receiptController),
);
log.info('GET /receipt/:receipt_id set');

receiptRoute.post(
  '/',
  [validateRequest({ body: CreateReceipt })],
  receiptController.createReceipt.bind(receiptController),
);
log.info('POST /receipt/ set ');

receiptRoute.put(
  '/:receipt_id',
  [validateRequest({ body: UpdateReceipt }), validateReceiptID],
  receiptController.updateReceipt.bind(receiptController),
);
log.info('PUT /receipt/:receipt_id set ');

receiptRoute.delete(
  '/:receipt_id',
  validateReceiptID,
  receiptController.deleteReceipt.bind(receiptController),
);
log.info('DELETE /receipt/:receipt_id set');

export default receiptRoute;
