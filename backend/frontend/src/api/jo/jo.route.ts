import { Router } from 'express';
import log from '../../../lib/logger';
import joborderRoute from './joborder/joborder.route';

const jomsRoute = Router({ mergeParams: true });

jomsRoute.use('/joborder', joborderRoute);
log.info('ROUTE sales set ');

export default jomsRoute;
