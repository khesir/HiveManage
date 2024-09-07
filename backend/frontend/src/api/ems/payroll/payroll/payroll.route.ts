import { Router } from 'express';
import { PayrollController } from './payroll.controller';

import { db } from '../../../../../mysql/mysql.pool';
import log from '../../../../../lib/logger';
import { validatePayrollId } from './payroll.middlewares';
import { validateRequest } from '../../../../../src/middlewares';
import { CreatePayroll, UpdatePayroll } from './payroll.model';

const payrollRoute = Router({ mergeParams: true });
const payrollController = new PayrollController(db);

payrollRoute.post(
  '/',
  validateRequest({ body: CreatePayroll }),
  payrollController.createPayRoll.bind(payrollController),
);
log.info('Post /payroll/ set');

payrollRoute.patch(
  '/:payroll_id',
  [validateRequest({ body: UpdatePayroll }), validatePayrollId],
  payrollController.updatePayroll.bind(payrollController),
);
log.info('PATCH /payroll/:payroll_id set');

payrollRoute.get('/', payrollController.getAllPayroll.bind(payrollController));
log.info('GET /payroll set');

payrollRoute.get(
  '/:payroll_id',
  validatePayrollId,
  payrollController.getPayrollId.bind(payrollController),
);
log.info('GET /payroll/:payroll_id set');

payrollRoute.delete(
  '/:payroll_id',
  validatePayrollId,
  payrollController.deletePayrollById.bind(payrollController),
);
log.info('DELETE /payroll/:payroll_id set');

export default payrollRoute;
