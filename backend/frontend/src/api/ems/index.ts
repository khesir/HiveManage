import { Router } from 'express';

import activityLogRoute from './company/activityLogs/activitylogs.route';
import log from '../../../lib/logger';

const emsRoute = Router({ mergeParams: true });

emsRoute.use('/activityLogs', activityLogRoute);
log.info('ROUTE /activityLogs set');

export default emsRoute;
