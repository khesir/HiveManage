import { Router } from 'express';

import employeeRoute from './employee/employee.route';
import departmentRoute from './department/department.route';
import designationRoute from './designation/designation.route';
import activityLogRoute from './activitylogs/activitylogs.route';

const emsRoute = Router({mergeParams: true})

emsRoute.use('/department', departmentRoute)
emsRoute.use('/designation', designationRoute)
emsRoute.use('/activity-logs', activityLogRoute)

export default emsRoute