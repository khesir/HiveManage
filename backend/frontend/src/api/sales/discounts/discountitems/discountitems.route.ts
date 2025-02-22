import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { DiscountItemController } from './discountitems.controller';
import {
  CreateDiscountItems,
  UpdateDiscountItems,
} from './discountitems.model';
import { validateDiscountItemsID } from './discountitems.middleware';

const discountitemsRoute = Router({ mergeParams: true });
const discountitemsController = new DiscountItemController(db);

discountitemsRoute.get(
  '/',
  discountitemsController.getAllDiscountItem.bind(discountitemsController),
);

discountitemsRoute.get(
  '/:discount_product_id',
  validateDiscountItemsID,
  discountitemsController.getDiscountItemById.bind(discountitemsController),
);

discountitemsRoute.post(
  '/',
  [validateRequest({ body: CreateDiscountItems })],
  discountitemsController.createDiscountItem.bind(discountitemsController),
);

discountitemsRoute.put(
  '/:discount_product_id',
  [validateRequest({ body: UpdateDiscountItems }), validateDiscountItemsID],
  discountitemsController.updateDiscountItem.bind(discountitemsController),
);

discountitemsRoute.delete(
  '/:discount_product_id',
  validateDiscountItemsID,
  discountitemsController.deleteDiscountItem.bind(discountitemsController),
);

export default discountitemsRoute;
