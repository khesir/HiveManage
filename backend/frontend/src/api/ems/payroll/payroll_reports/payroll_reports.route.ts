import { Router } from 'express';

import { db } from '../../../../../mysql/mysql.pool';
import log from '../../../../../lib/logger';
import { PayrollReportsController } from './payroll_reports.controller';

const payrollreportRoute = Router({ mergeParams: true });
const payrollreportController = new PayrollReportsController(db);

payrollreportRoute.patch(
  '/:payroll_report',
  payrollreportController.updatePayroll.bind(payrollreportController),
);
log.info('PATCH /payroll/:payroll_reports set');

export default payrollreportRoute;
