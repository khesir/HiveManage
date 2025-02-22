import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { CouponRedemptionController } from './couponRedemption.controller';
import { validateCouponRedemptionID } from './couponRedemption.middleware';
import {
  CreateCouponRedemption,
  UpdateCouponRedemption,
} from './couponRedemption.model';

const couponredemptionRoute = Router({ mergeParams: true });
const couponredemptionController = new CouponRedemptionController(db);

couponredemptionRoute.get(
  '/',
  couponredemptionController.getAllCouponRedemption.bind(
    couponredemptionController,
  ),
);

couponredemptionRoute.get(
  '/:couponredemptions_id',
  validateCouponRedemptionID,
  couponredemptionController.getCouponRedemptionById.bind(
    couponredemptionController,
  ),
);

couponredemptionRoute.post(
  '/',
  [validateRequest({ body: CreateCouponRedemption })],
  couponredemptionController.createCouponRedemption.bind(
    couponredemptionController,
  ),
);

couponredemptionRoute.put(
  '/:couponredemptions_id',
  [
    validateRequest({ body: UpdateCouponRedemption }),
    validateCouponRedemptionID,
  ],
  couponredemptionController.updateCouponRedemption.bind(
    couponredemptionController,
  ),
);

couponredemptionRoute.delete(
  '/:couponredemptions_id',
  validateCouponRedemptionID,
  couponredemptionController.deleteCouponRedemption.bind(
    couponredemptionController,
  ),
);

export default couponredemptionRoute;
