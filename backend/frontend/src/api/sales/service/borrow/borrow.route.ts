import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { BorrowController } from './borrow.controller';
import { validateBorrowID } from './borrow.middleware';
import { CreateBorrow, UpdateBorrow } from './borrow.model';
import borrowitemsRoute from './borrow_items/borrowitems.route';

const borrowRoute = Router({ mergeParams: true });
const borrowController = new BorrowController(db);

borrowRoute.get('/', borrowController.getAllBorrow.bind(borrowController));

borrowRoute.get(
  '/:borrow_id',
  validateBorrowID,
  borrowController.getBorrowById.bind(borrowController),
);

borrowRoute.post(
  '/',
  [validateRequest({ body: CreateBorrow })],
  borrowController.createBorrow.bind(borrowController),
);

borrowRoute.put(
  '/:borrow_id',
  [validateRequest({ body: UpdateBorrow }), validateBorrowID],
  borrowController.updateBorrow.bind(borrowController),
);

borrowRoute.delete(
  '/:borrow_id',
  validateBorrowID,
  borrowController.deleteBorrow.bind(borrowController),
);

borrowRoute.use('/:borrow_id/borrowitem', validateBorrowID, borrowitemsRoute);

export default borrowRoute;
