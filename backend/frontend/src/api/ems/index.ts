import { Router } from 'express';

import log from '@/lib/logger';
import departmentRoute from './company/department/department.route';
import designationRoute from './company/designation/designation.route';
import payrollRoute from './payroll/payroll/payroll.route';
import leaveLimitRoute from './company/leaveLimit/leaveLimit.route';
import leaveRequestRoute from './company/leaveRequest/leaveRequest.route';
import employeeRoute from './employee/employee/employee.route';
import signatoryRoute from './payroll/signatory/signatory.route';
import payrollApprovalRoute from './payroll/payroll_approval/payrollApproval.route';
import payrollReportRoute from './payroll/payroll_reports/payrollReports.route';
import auditRoute from './company/auditlogs/auditlogs.route';
import employeeroleRoute from './roles/roles.route';
import employeeRolesRoute from './employeeRoles/employeeRoles.route';

const emsRoute = Router({ mergeParams: true });

emsRoute.use('/auditLogs', auditRoute);
log.info('ROUTE /activityLogs set');

emsRoute.use('/departments', departmentRoute);
log.info('ROUTE /department set');

emsRoute.use('/designations', designationRoute);
log.info('ROUTE /designation set');

emsRoute.use('/payrolls', payrollRoute);
log.info('ROUTE /payroll set');

emsRoute.use('/leaveLimits', leaveLimitRoute);
log.info('ROUTE /leaveLimit set');

emsRoute.use('/leaveRequests', leaveRequestRoute);
log.info('ROUTE /leaveRequest set');

emsRoute.use('/employees', employeeRoute);
log.info('ROUTe /employee set');

emsRoute.use('/signatories', signatoryRoute);
log.info('ROUTE /signatory set');

emsRoute.use('/payrollApprovals', payrollApprovalRoute);
log.info('ROUTE /payrollApproval set');

emsRoute.use('/payrollReports', payrollReportRoute);
log.info('ROUTE /payrollReports set');

emsRoute.use('/roles', employeeroleRoute);
log.info('ROUTE /roles set');

emsRoute.use('/employee-roles', employeeRolesRoute);

export default emsRoute;
