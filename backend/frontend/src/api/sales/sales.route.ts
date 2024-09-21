import { Router } from 'express';
import salesRoute from './sales/sales.route';
import log from '../../../lib/logger';

const smsRoute = Router({ mergeParams: true });

smsRoute.use('/sales', salesRoute);
log.info('ROUTE sales set ');

export default smsRoute;
