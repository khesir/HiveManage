import { Router } from 'express';

import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { PayrollReportsController } from './payrollReports.controller';

const payrollReportRoute = Router({ mergeParams: true });
const payrollReportController = new PayrollReportsController(db);

payrollReportRoute.patch(
  '/:payroll_report',
  payrollReportController.updatePayrollReports.bind(payrollReportController),
);
log.info('PATCH /payroll/:payroll_reports set');

payrollReportRoute.post(
  '/',
  payrollReportController.createPayrollReports.bind(payrollReportController),
);
log.info('Post /reports set');

payrollReportRoute.get(
  '/',
  payrollReportController.getAllPayrollReports.bind(payrollReportController),
);
log.info('GET /payrollReports set');

payrollReportRoute.get(
  '/:payroll_report',
  payrollReportController.getAllPayrollReportsById.bind(
    payrollReportController,
  ),
);
log.info('GET /payrollReports/:payrollReports_id set');

payrollReportRoute.delete(
  '/:payroll_report',
  payrollReportController.deletePayrollReportsById.bind(
    payrollReportController,
  ),
);
log.info('DELETE /payrollReports/:payroll_report set');

export default payrollReportRoute;
