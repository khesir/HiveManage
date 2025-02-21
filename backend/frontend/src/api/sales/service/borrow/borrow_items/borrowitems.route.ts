import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { BorrowItemController } from './borrowitems.controller';
import { validateBorrowItemID } from './borrowitems.middleware';
import { CreateBorrowItem, UpdateBorrowItem } from './borrowitems.model';

const borrowitemsRoute = Router({ mergeParams: true });
const borrowitemsController = new BorrowItemController(db);

borrowitemsRoute.get(
  '/',
  borrowitemsController.getAllBorrowItem.bind(borrowitemsController),
);

borrowitemsRoute.get(
  '/:borrow_item_id',
  validateBorrowItemID,
  borrowitemsController.getBorrowItemById.bind(borrowitemsController),
);

borrowitemsRoute.post(
  '/',
  [validateRequest({ body: CreateBorrowItem })],
  borrowitemsController.createBorrowItem.bind(borrowitemsController),
);

borrowitemsRoute.put(
  '/:borrow_item_id',
  [validateRequest({ body: UpdateBorrowItem }), validateBorrowItemID],
  borrowitemsController.updateBorrowItem.bind(borrowitemsController),
);

borrowitemsRoute.delete(
  '/:borrow_item_id',
  validateBorrowItemID,
  borrowitemsController.deleteBorrowItem.bind(borrowitemsController),
);

export default borrowitemsRoute;
