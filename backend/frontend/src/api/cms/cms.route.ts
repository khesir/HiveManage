import { Router } from 'express';
import log from '../../../lib/logger';
import customerRoute from './customer/customer.route';

const cmsRoute = Router({ mergeParams: true });

cmsRoute.use('/customer', customerRoute);
log.info('ROUTE customer set ');

export default cmsRoute;
