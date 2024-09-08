import { Router } from 'express';

import { db } from '../../../../../mysql/mysql.pool';
import log from '../../../../../lib/logger';
import { PayrollReportsController } from './payroll_reports.controller';

const payrollReportRoute = Router({ mergeParams: true });
const payrollReportController = new PayrollReportsController(db);

payrollReportRoute.patch(
  '/:payroll_report',
  payrollReportController.updatePayrollReports.bind(payrollReportController),
);
log.info('PATCH /payroll/:payroll_reports set');

export default payrollReportRoute;
