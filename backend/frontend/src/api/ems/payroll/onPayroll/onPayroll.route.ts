import { Router } from 'express';

import { db } from '../../../../../mysql/mysql.pool';
import log from '../../../../../lib/logger';
import { OnPayrollController } from './onPayroll.controller';
import { validateRequest } from '../../../../middlewares';
import { CreateOnPayrollArray, UpadteOnPayrollArray } from './onPayroll.model';
import { validatePayrollId } from './onPayroll.middlewares';

const onPayrollRoute = Router({ mergeParams: true });
const controller = new OnPayrollController(db);

onPayrollRoute.get(
  '/',
  validatePayrollId,
  controller.getAllOnPayroll.bind(controller),
);

onPayrollRoute.post(
  '/',
  validateRequest({ body: CreateOnPayrollArray }),
  controller.createOnPayroll.bind(controller),
);
log.info(`POST /onPayroll set`);

onPayrollRoute.patch(
  '/',
  [validateRequest({ body: UpadteOnPayrollArray }), validatePayrollId],
  controller.updateOnpayroll.bind(controller),
);
log.info(`PATCH /onPayroll set`);

export default onPayrollRoute;
