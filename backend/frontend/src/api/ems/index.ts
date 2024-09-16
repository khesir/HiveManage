import { Router } from 'express';

import activityLogRoute from './company/activityLogs/activitylogs.route';
import log from '../../../lib/logger';
import departmentRoute from './company/department/department.route';
import designationRoute from './company/designation/designation.route';
import payrollRoute from './payroll/payroll/payroll.route';
import leaveLimitRoute from './company/leaveLimit/leaveLimit.route';
import leaveRequestRoute from './company/leaveRequest/leaveRequest.route';
import employeeRoute from './employee/employee/employee.route';
import signatoryRoute from './payroll/signatory/signatory.route';
import onPayrollRoute from './payroll/onPayroll/onPayroll.route';
import payrollApprovalRoute from './payroll/payroll_approval/payrollApproval.route';
import benefitRoute from './fees/benefits/benefits.route';
import deductionRoute from './fees/deductions/deductions.route';
import payrollReportRoute from './payroll/payroll_reports/payrollReports.route';
import additionalPayRoute from './fees/additional_pay/additionalPay.route';
import adjustmentsRoute from './fees/adjustments/adjustments.route';

const emsRoute = Router({ mergeParams: true });

emsRoute.use('/activityLogs', activityLogRoute);
log.info('ROUTE /activityLogs set');

emsRoute.use('/department', departmentRoute);
log.info('ROUTE /department set');

emsRoute.use('/designation', designationRoute);
log.info('ROUTE /designation set');

emsRoute.use('/payroll', payrollRoute);
log.info('ROUTE /payroll set');

emsRoute.use('/leaveLimit', leaveLimitRoute);
log.info('ROUTE /leaveLimit set');

emsRoute.use('/leaveRequest', leaveRequestRoute);
log.info('ROUTE /leaveRequest set');

emsRoute.use('/employees', employeeRoute);
log.info('ROUTe /employee set');

emsRoute.use('/signatory', signatoryRoute);
log.info('ROUTE /signatory set');

emsRoute.use('/onPayroll', onPayrollRoute);
log.info('ROUTE /onPayroll set');

emsRoute.use('/payrollApproval', payrollApprovalRoute);
log.info('ROUTE /payrollApproval set');

emsRoute.use('/benefits', benefitRoute);
log.info('ROUTE /benefit set');

emsRoute.use('/deductions', deductionRoute);
log.info('ROUTE /deductions set');

emsRoute.use('/payrollReport', payrollReportRoute);
log.info('ROUTE /payrollReports set');

emsRoute.use('/additionalPay', additionalPayRoute);
log.info('ROUTE /additionalPay');

emsRoute.use('/adjustments', adjustmentsRoute);
log.info('ROUTE /adjustments set');

export default emsRoute;
