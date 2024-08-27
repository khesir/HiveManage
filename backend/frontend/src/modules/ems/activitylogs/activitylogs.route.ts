import { Router } from 'express';
import { ActivityLogController } from './activitylogs.controller';
import pool from '../../../config/mysql.config';

const activityLogRoute = Router();
const activityLogsController = new ActivityLogController(pool);

activityLogRoute.post('/', activityLogsController.createActivityLog.bind(activityLogsController));
activityLogRoute.get('/', activityLogsController.getAllActivityLogs.bind(activityLogsController));
activityLogRoute.get('/:activity_id', activityLogsController.getActivityLogById.bind(activityLogsController));

export default activityLogRoute;
