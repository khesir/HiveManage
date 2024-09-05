import { Router } from 'express';

import activityLogRoute from './company/activityLogs/activitylogs.route';
import log from '../../../lib/logger';
import departmentRoute from './company/department/department.route';
import designationRoute from './company/designation/designation.route';
import leaveLimitRoute from './company/leaveLimit/leaveLimit.route';
import leaveRequestRoute from './company/leaveRequest/leaveRequest.route';
import employeeRoute from './employee/employee/employee.route';
import employmentInformationRoute from './employee/employmentInformation/employmentInformation.route';
import financiallInformationRoute from './employee/financialInformation/financialInformation.route';

const emsRoute = Router({ mergeParams: true });

emsRoute.use('/activityLogs', activityLogRoute);
log.info('ROUTE /activityLogs set');

emsRoute.use('/department', departmentRoute);
log.info('ROUTE /department set');

emsRoute.use('/designation', designationRoute);
log.info('ROUTE /designation set');

emsRoute.use('/leaveLimit', leaveLimitRoute);
log.info('ROUTE /leaveLimit set');

emsRoute.use('/leaveRequest', leaveRequestRoute);
log.info('ROUTE /leaveRequest set');

emsRoute.use('/employee', employeeRoute);
log.info('ROUTe /employee set');

emsRoute.use('/employmentInformation', employmentInformationRoute);
log.info('ROUTE /employmentInformation set');

emsRoute.use('/financialInformation', financiallInformationRoute);
log.info('ROUTE /financialInformation set');

export default emsRoute;
