import { Router } from 'express';
import log from '../../../lib/logger';
import customerRoute from './customer/customer.route';
import inquiryRoute from './inquiry/inquiry.route';

const cmsRoute = Router({ mergeParams: true });

cmsRoute.use('/customer', customerRoute);
log.info('ROUTE customer set ');

cmsRoute.use('/inquiry', inquiryRoute);
log.info('ROUTE inquiry set');

export default cmsRoute;
