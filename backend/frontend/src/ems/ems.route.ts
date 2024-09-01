import { Router } from 'express';

import employeeRoute from './employee/employee/employee.route';
import departmentRoute from './company/department/department.route';
import designationRoute from './company/designation/designation.route';
import activityLogRoute from './company/activity_logs/activitylogs.route';

const emsRoute = Router({ mergeParams: true });

emsRoute.use('/department', departmentRoute);
emsRoute.use('/designation', designationRoute);
emsRoute.use('/activity-logs', activityLogRoute);
emsRoute.use('/employee', employeeRoute);

export default emsRoute;
