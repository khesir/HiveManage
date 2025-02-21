import { Router } from 'express';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { validateRequest } from '@/src/middlewares';
import { CustomerGroupController } from './customergroup.controller';
import { validateCustomerID } from '../customer.middleware';
import { validateCustomerGroupID } from './customergroup.middleware';
import {
  CreateCustomerGroup,
  UpdateCustomerGroup,
} from './customergroup.model';

const customergroupRoute = Router({ mergeParams: true });
const customergroupController = new CustomerGroupController(db);

customergroupRoute.get(
  '/',
  customergroupController.getAllCustomerGroup.bind(customergroupController),
);
log.info('GET /customerGroup set');

customergroupRoute.get(
  '/:customer_group_id',
  validateCustomerGroupID,
  customergroupController.getCustomerGroupById.bind(customergroupController),
);
log.info('GET /customerGroup/:customer_id set');

customergroupRoute.post(
  '/',
  [validateRequest({ body: CreateCustomerGroup })],
  customergroupController.createCustomerGroup.bind(customergroupController),
);
log.info('POST /customerGroup/ set ');

customergroupRoute.put(
  '/:customer_group_id',
  [validateRequest({ body: UpdateCustomerGroup }), validateCustomerGroupID],
  customergroupController.updateCustomerGroup.bind(customergroupController),
);
log.info('PUT /customerGroup/:customer_group_id set ');

customergroupRoute.delete(
  '/:customer_group_id',
  validateCustomerID,
  customergroupController.deleteCustomerGroup.bind(customergroupController),
);
log.info('DELETE /customerGroup/:customer_group_id set');

export default customergroupRoute;
