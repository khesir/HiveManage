import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';
import { RemarkItemsController } from './remarkitems.controller';
import { validateRemarkItemsID } from './remarkitems.middleware';
import { CreateRemarkItems, UpdateRemarkItems } from './remarkitems.model';

const remarkItemsRoute = Router({ mergeParams: true });
const remarkItemsController = new RemarkItemsController(db);

remarkItemsRoute.get(
  '/',
  remarkItemsController.getAllRemarkItems.bind(remarkItemsController),
);

remarkItemsRoute.get(
  '/:remark_items_id',
  validateRemarkItemsID,
  remarkItemsController.getRemarkItemsById.bind(remarkItemsController),
);

remarkItemsRoute.post(
  '/',
  [validateRequest({ body: CreateRemarkItems })],
  remarkItemsController.createRemarkItems.bind(remarkItemsController),
);

remarkItemsRoute.put(
  '/:remark_items_id',
  [validateRequest({ body: UpdateRemarkItems }), validateRemarkItemsID],
  remarkItemsController.updateRemarkItems.bind(remarkItemsController),
);

remarkItemsRoute.delete(
  '/:remark_items_id',
  validateRemarkItemsID,
  remarkItemsController.deleteRemarkItems.bind(remarkItemsController),
);

export default remarkItemsRoute;
