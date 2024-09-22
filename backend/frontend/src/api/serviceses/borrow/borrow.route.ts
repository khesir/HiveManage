import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/mysql/mysql.pool';
import log from '@/lib/logger';
import { BorrowController } from './borrow.controller';
import { validateBorrowID } from './borrow.middleware';
import { CreateBorrow, UpdateBorrow } from './borrow.model';

const borrowRoute = Router({ mergeParams: true });
const borrowController = new BorrowController(db);

borrowRoute.get('/', borrowController.getAllBorrow.bind(borrowController));
log.info('GET /borrow set');

borrowRoute.get(
  '/:borrow_id',
  validateBorrowID,
  borrowController.getBorrowById.bind(borrowController),
);
log.info('GET /borrow/:borrow_id set');

borrowRoute.post(
  '/',
  [validateRequest({ body: CreateBorrow })],
  borrowController.createBorrow.bind(borrowController),
);
log.info('POST /borrow/ set ');

borrowRoute.put(
  '/:borrow_id',
  [validateRequest({ body: UpdateBorrow }), validateBorrowID],
  borrowController.updateBorrow.bind(borrowController),
);
log.info('PUT /borrow/:borrow_id set ');

borrowRoute.delete(
  '/:borrow_id',
  validateBorrowID,
  borrowController.deleteBorrow.bind(borrowController),
);
log.info('DELETE /borrow/:borrow_id set');

export default borrowRoute;
