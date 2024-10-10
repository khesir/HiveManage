import { Router } from 'express';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { validateRequest } from '@/src/middlewares';
import { CustomerController } from './customer.controller';
import { validateCustomerID } from './customer.middleware';
import { CreateCustomer, UpdateCustomer } from './customer.model';

const customerRoute = Router({ mergeParams: true });
const customerController = new CustomerController(db);

customerRoute.get(
  '/',
  customerController.getAllCustomer.bind(customerController),
);
log.info('GET /customer set');

customerRoute.get(
  '/:customer_id',
  validateCustomerID,
  customerController.getCustomerById.bind(customerController),
);
log.info('GET /customer/:customer_id set');

customerRoute.post(
  '/',
  [validateRequest({ body: CreateCustomer })],
  customerController.createCustomer.bind(customerController),
);
log.info('POST /customer/ set ');

customerRoute.put(
  '/:customer_id',
  [validateRequest({ body: UpdateCustomer }), validateCustomerID],
  customerController.updateCustomer.bind(customerController),
);
log.info('PUT /customer/:customer_id set ');

customerRoute.delete(
  '/:customer_id',
  validateCustomerID,
  customerController.deleteCustomer.bind(customerController),
);
log.info('DELETE /customer/:customer_id set');

export default customerRoute;
