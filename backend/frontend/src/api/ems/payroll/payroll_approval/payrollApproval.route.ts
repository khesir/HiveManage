import { Router } from 'express';
import { db } from '../../../../../mysql/mysql.pool';
import { validateRequest } from '../../../../middlewares';
import log from '../../../../../lib/logger';
import { PayrollApprovalController } from './payrollApproval.controller';
import { CreatePayrollApproval, UpdatePayrollApproval } from './payrollApproval.model';
import {
    validateOnPayrollId,
  validatePayrollApprovalId,
  validateSignatoryId,
} from './payrollApproval.middlewares';

const payrollApprovalRoute = Router({ mergeParams: true });
const controller = new PayrollApprovalController(db);

payrollApprovalRoute.post(
    '/',
    [
      validateRequest({
        body: CreatePayrollApproval,
      }),
      validateOnPayrollId,
      validateSignatoryId,
    ],
    controller.createPayrollApproval.bind(controller),
);
log.info('POST /payrollApproval set');

payrollApprovalRoute.get(
    '/',
    validateOnPayrollId,
    controller.getPayrollApprovalById.bind(controller),
  );
log.info('GET /payrollApproval/ set');
  
payrollApprovalRoute.get(
    '/:payroll_approval_id',
    validatePayrollApprovalId,
    controller.getAllPayrollApprovals.bind(controller),
  );
log.info('GET /payrollApproval/:payroll_approval_id set');

payrollApprovalRoute.put(
'/:payroll_approval_id',
[
    validateRequest({
    body: UpdatePayrollApproval,
    }),
    validateOnPayrollId,
    validateSignatoryId,
],
controller.updatePayrollApproval.bind(controller),
);
log.info('PUT /payrollApproval/:payroll_approval_id set');

payrollApprovalRoute.delete(
    '/:payroll_approval_id',
    validatePayrollApprovalId,
    controller.deletePayrollApproval.bind(controller),
);
log.info('DELETE /payrollApproval/:payroll_approval_id set');

export default payrollApprovalRoute;
