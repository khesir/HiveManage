import { Router } from 'express';
import log from '@/lib/logger';
import serviceRoute from './service/serviceses.route';

const smsRoute = Router({ mergeParams: true });

smsRoute.use('/service', serviceRoute);
log.info('ROUTE service set');

export default smsRoute;
