import { Router } from 'express';

import { db } from '../../../../../mysql/mysql.pool';
import log from '../../../../../lib/logger';
import { OnPayrollController } from './onpayroll.controller';
import { validateRequest } from '../../../../middlewares';
import { OnPayrollArray } from './onpayroll.model';

const onPayrollRoute = Router({ mergeParams: true });
const controller = new OnPayrollController(db);

onPayrollRoute.post(
  '/',
  validateRequest({ body: OnPayrollArray }),
  controller.createOnPayroll.bind(controller),
);
log.info(`POST /onPayroll set`);

export default onPayrollRoute;
