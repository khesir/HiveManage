import { Router } from 'express';
import salesRoute from './sales/sales.route';
import log from '@/lib/logger';
import salesitemRoute from './salesItem/salesItem.route';
import serviceRoute from './service/serviceses.route';

const smsRoute = Router({ mergeParams: true });

smsRoute.use('/sales', salesRoute);
log.info('ROUTE sales set ');

smsRoute.use('/salesitem', salesitemRoute);
log.info('ROUTE salesitem set');

smsRoute.use('/service', serviceRoute);
log.info('ROUTE service set');

export default smsRoute;
