import { Router } from 'express';
import log from '@/lib/logger';
import joborderRoute from './joborder/joborder.route';
import reportsRoute from './reports/reports.route';

const jomsRoute = Router({ mergeParams: true });

jomsRoute.use('/joborder', joborderRoute);
log.info('ROUTE sales set ');

jomsRoute.use('/reports', reportsRoute);
log.info('ROUTE reports set');

export default jomsRoute;
