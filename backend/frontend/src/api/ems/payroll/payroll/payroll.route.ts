import { Router } from 'express';
import { PayrollController } from './payroll.controller';

import { CreatePayroll } from './payroll.model';
import { validatePayrollId } from './payroll.middleware';
import { db } from '../../../../../mysql/mysql.pool';
import log from '../../../../../lib/logger';
import { validateRequest } from '../../../../../src/middlewares';

const payrollRoute = Router({ mergeParams: true });
const payrollController = new PayrollController(db);

payrollRoute.post(
  '/',
  [validateRequest({ body: CreatePayroll }), validatePayrollId],
  payrollController.createPayRoll.bind(payrollController),
);
log.info('Post /payroll/ set');

payrollRoute.get(
  '/payroll_id',
  validatePayrollId,
  payrollController.getPayRollById.bind(payrollController),
);
log.info('GET /payroll/:payroll_id set');

export default payrollRoute;
