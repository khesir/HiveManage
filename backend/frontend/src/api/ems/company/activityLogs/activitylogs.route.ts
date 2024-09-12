import { Router } from 'express';
import { ActivityLogController } from './activitylogs.controller';

import { CreateActivityLog, UpdateActivityLog } from './activitylogs.model';
import {
  validateActivityEmployeeID,
  validateActivityID,
} from './activitylogs.middleware';
import { validateRequest } from '../../../../middlewares';
import { db } from '../../../../../mysql/mysql.pool';
import log from '../../../../../lib/logger';
const activityRoute = Router({ mergeParams: true });
const activityLogsController = new ActivityLogController(db);

activityRoute.get(
  '/',
  activityLogsController.getAllActivityLogs.bind(activityLogsController),
);
log.info('GET /activityLogs set');

activityRoute.get(
  '/:activity_id',
  validateActivityID,
  activityLogsController.getActivityLogById.bind(activityLogsController),
);
log.info('GET /activityLogs/:activity_id set');

activityRoute.patch(
  '/',
  [
    validateRequest({
      body: CreateActivityLog,
    }),
    validateActivityEmployeeID,
  ],
  activityLogsController.createActivityLog.bind(activityLogsController),
);
log.info('POST /activityLogs/ set');

activityRoute.put(
  '/:activity_id',
  [
    validateRequest({
      body: UpdateActivityLog,
    }),
    validateActivityEmployeeID,
    validateActivityID,
  ],
  activityLogsController.updateActivityLog.bind(activityLogsController),
);
log.info('PUT /activityLogs/:activity_id set');

activityRoute.delete(
  '/:activity_id',
  validateActivityID,
  activityLogsController.deleteActivityLogbyID.bind(activityLogsController),
);
log.info('DELETE /activityLogs/:activity_id set');

export default activityRoute;
