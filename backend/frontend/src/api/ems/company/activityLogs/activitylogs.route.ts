import { Router } from 'express';
import { ActivityLogController } from './activitylogs.controller';

import { ActivityLog } from './activitylogs.model';
import {
  validateActivityEmployeeID,
  validateActivtyId,
} from './activitylogs.middleware';
import { validateRequest } from '../../../../../src/middlewares';
import { db } from '../../../../../mysql/mysql.pool';
import log from '../../../../../lib/logger';
const activityRoute = Router({ mergeParams: true });
const activityLogsController = new ActivityLogController(db);

activityRoute.post(
  '/',
  [
    validateRequest({
      body: ActivityLog,
    }),
    validateActivityEmployeeID,
  ],
  activityLogsController.createActivityLog.bind(activityLogsController),
);
log.info('POST /activityLogs/ set');

activityRoute.get(
  '/',
  activityLogsController.getAllActivityLogs.bind(activityLogsController),
);
log.info('GET /activityLogs set');

activityRoute.get(
  '/:activity_id',
  validateActivtyId,
  activityLogsController.getActivityLogById.bind(activityLogsController),
);
log.info('GET /activityLogs/id set');

activityRoute.put(
  '/:activity_id',
  [
    validateRequest({
      body: ActivityLog,
    }),
    validateActivityEmployeeID,
    validateActivtyId,
  ],
  activityLogsController.updateActivityLog.bind(activityLogsController),
);

export default activityRoute;
