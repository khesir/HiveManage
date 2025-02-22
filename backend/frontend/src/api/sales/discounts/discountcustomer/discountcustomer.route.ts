import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { DiscountCustomerController } from './discountcustomer.controller';
import { validateDiscountCustomerID } from './discountcustomer.middleware';
import {
  CreateDiscountCustomer,
  UpdateDiscountCustomer,
} from './discountcustomer.model';

const discountcustomerRoute = Router({ mergeParams: true });
const discountcustomerController = new DiscountCustomerController(db);

discountcustomerRoute.get(
  '/',
  discountcustomerController.getAllDiscountCustomer.bind(
    discountcustomerController,
  ),
);

discountcustomerRoute.get(
  '/:discount_customer_id',
  validateDiscountCustomerID,
  discountcustomerController.getDiscountCustomerById.bind(
    discountcustomerController,
  ),
);

discountcustomerRoute.post(
  '/',
  [validateRequest({ body: CreateDiscountCustomer })],
  discountcustomerController.createDiscountCustomer.bind(
    discountcustomerController,
  ),
);

discountcustomerRoute.put(
  '/:discount_customer_id',
  [
    validateRequest({ body: UpdateDiscountCustomer }),
    validateDiscountCustomerID,
  ],
  discountcustomerController.updateDiscountCustomer.bind(
    discountcustomerController,
  ),
);

discountcustomerRoute.delete(
  '/:discount_customer_id',
  validateDiscountCustomerID,
  discountcustomerController.deleteDiscountCustomer.bind(
    discountcustomerController,
  ),
);

export default discountcustomerRoute;
