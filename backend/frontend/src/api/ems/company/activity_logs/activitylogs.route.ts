import { Router } from 'express';
import { ActivityLogController } from './activitylogs.controller';
import { db } from '@/mysql/mysql.pool';
import { validateRequest } from '@/src/middlewares';
import { ActivityLog } from './activitylogs.model';
const route = Router();
const activityLogsController = new ActivityLogController(db);

route.post(
  '/',
  validateRequest({
    body: ActivityLog,
  }),
  activityLogsController.createActivityLog.bind(activityLogsController),
);

route.get(
  '/',
  activityLogsController.getAllActivityLogs.bind(activityLogsController),
);
route.get(
  '/:activity_id',
  activityLogsController.getActivityLogById.bind(activityLogsController),
);

export default route;
