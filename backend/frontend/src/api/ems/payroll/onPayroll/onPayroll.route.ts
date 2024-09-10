import { Router } from 'express';

import { db } from '../../../../../mysql/mysql.pool';
import log from '../../../../../lib/logger';
import { OnPayrollController } from './onPayroll.controller';
import { validateRequest } from '../../../../middlewares';
import { CreateOnPayrollArray } from './onPayroll.model';
import { validateOnPayrollID } from '../payroll_approval/payrollApproval.middlewares';

const onPayrollRoute = Router({ mergeParams: true });
const controller = new OnPayrollController(db);

onPayrollRoute.post(
  '/',
  validateRequest({ body: CreateOnPayrollArray }),
  controller.createOnPayroll.bind(controller),
);
log.info(`POST /onPayroll set`);

onPayrollRoute.patch(
  '/',
  validateOnPayrollID,
  controller.updateOnpayroll.bind(controller),
);
log.info(`PATCH /onPayroll set`);

export default onPayrollRoute;
