import { Router } from 'express';
import log from '../../../lib/logger';
import serviceRoute from './serviceses/serviceses.route';
import reserveRoute from './reserve/reserve.route';
import borrowRoute from './borrow/borrow.route';

const srmsRoute = Router({ mergeParams: true });

srmsRoute.use('/service', serviceRoute);
log.info('ROUTE sales set ');

srmsRoute.use('/reserve', reserveRoute);
log.info('ROUTE reserve set');

srmsRoute.use('/borrow', borrowRoute);
log.info('ROUTE borrow set');
export default srmsRoute;
