import { Router } from 'express';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { validateRequest } from '@/src/middlewares';
import { DiscountController } from './discount.controller';
import { validateDiscountID } from './discount.middleware';
import { CreateDiscount, UpdateDiscount } from './discount.model';
import couponredemptionRoute from './couponRedemption/couponRedemption.route';
import discountcustomerRoute from './discountcustomer/discountcustomer.route';
import discountitemsRoute from './discountitems/discountitems.route';

const discountRoute = Router({ mergeParams: true });
const discountController = new DiscountController(db);

discountRoute.get(
  '/',
  discountController.getAllDiscount.bind(discountController),
);
log.info('GET /discount set');

discountRoute.get(
  '/:discount_id',
  validateDiscountID,
  discountController.getDiscountById.bind(discountController),
);
log.info('GET /discount/:discount_id set');

discountRoute.post(
  '/',
  [validateRequest({ body: CreateDiscount })],
  discountController.createDiscount.bind(discountController),
);
log.info('POST /discount/ set ');

discountRoute.put(
  '/:discount_id',
  [validateRequest({ body: UpdateDiscount }), validateDiscountID],
  discountController.updateDiscount.bind(discountController),
);
log.info('PUT /discount/:discount_id set ');

discountRoute.delete(
  '/:discount_id',
  validateDiscountID,
  discountController.deleteDiscount.bind(discountController),
);
log.info('DELETE /discount/:discount_id set');

discountRoute.use('/:discount_id/discountProduct', discountitemsRoute);

discountRoute.use('/:discount_id/discountCustomer', discountcustomerRoute);

discountRoute.use('/:discount_id/couponRedemptions', couponredemptionRoute);

export default discountRoute;
