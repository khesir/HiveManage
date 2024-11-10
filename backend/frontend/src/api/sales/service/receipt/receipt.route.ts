import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { ReceiptController } from './receipt.controller';
import { validateReceiptID } from './receipt.middleware';
import { CreateReceipt, UpdateReceipt } from './receipt.model';

const receiptRoute = Router({ mergeParams: true });
const receiptController = new ReceiptController(db);

receiptRoute.get('/', receiptController.getAllReceipt.bind(receiptController));

receiptRoute.get(
  '/:receipt_id',
  validateReceiptID,
  receiptController.getReceiptById.bind(receiptController),
);

receiptRoute.post(
  '/',
  [validateRequest({ body: CreateReceipt })],
  receiptController.createReceipt.bind(receiptController),
);

receiptRoute.put(
  '/:receipt_id',
  [validateRequest({ body: UpdateReceipt }), validateReceiptID],
  receiptController.updateReceipt.bind(receiptController),
);

receiptRoute.delete(
  '/:receipt_id',
  validateReceiptID,
  receiptController.deleteReceipt.bind(receiptController),
);

export default receiptRoute;
