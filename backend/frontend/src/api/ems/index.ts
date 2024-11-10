import { Router } from 'express';

import departmentRoute from './company/department/department.route';
import designationRoute from './company/designation/designation.route';
import payrollRoute from './payroll/payroll/payroll.route';
import leaveLimitRoute from './company/leaveLimit/leaveLimit.route';
import leaveRequestRoute from './company/leaveRequest/leaveRequest.route';
import employeeRoute from './employee/employee/employee.route';
import signatoryRoute from './payroll/signatory/signatory.route';
import payrollApprovalRoute from './payroll/payroll_approval/payrollApproval.route';
import payrollReportRoute from './payroll/payroll_reports/payrollReports.route';
import employeeroleRoute from './roles/roles.route';
import employeeRolesRoute from './employeeRoles/employeeRoles.route';
import positionRoute from './position/position.route';

const emsRoute = Router({ mergeParams: true });

emsRoute.use('/departments', departmentRoute);

emsRoute.use('/designations', designationRoute);

emsRoute.use('/payrolls', payrollRoute);

emsRoute.use('/leaveLimits', leaveLimitRoute);

emsRoute.use('/leaveRequests', leaveRequestRoute);

emsRoute.use('/employees', employeeRoute);

emsRoute.use('/signatories', signatoryRoute);

emsRoute.use('/payrollApprovals', payrollApprovalRoute);

emsRoute.use('/payrollReports', payrollReportRoute);

emsRoute.use('/roles', employeeroleRoute);

emsRoute.use('/employee-roles', employeeRolesRoute);

emsRoute.use('/position', positionRoute);

export default emsRoute;
