import { Router } from 'express';
import log from '@/lib/logger';
import serviceRoute from './serviceses/serviceses.route';

const srmsRoute = Router({ mergeParams: true });

srmsRoute.use('/service', serviceRoute);
log.info('ROUTE sales set ');

export default srmsRoute;
