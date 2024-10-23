import { Router } from 'express';
import log from '@/lib/logger';
import salesitemRoute from './salesItem/salesItem.route';
import serviceRoute from './service/serviceses.route';
import jobordertypesRoute from './jobordertypes/jobordertypes.route';

const smsRoute = Router({ mergeParams: true });

smsRoute.use('/salesitem', salesitemRoute);
log.info('ROUTE salesitem set');

smsRoute.use('/service', serviceRoute);
log.info('ROUTE service set');

smsRoute.use('/jobordertypes', jobordertypesRoute);
log.info('ROUTE job order types');

export default smsRoute;
