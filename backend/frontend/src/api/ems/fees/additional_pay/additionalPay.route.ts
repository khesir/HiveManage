import { Router } from 'express';

import { db } from '../../../../../mysql/mysql.pool';
import log from '../../../../../lib/logger';
import { validateRequest } from '../../../../../src/middlewares';
import { AdditionalPayController } from './additionalPay.controller';
import { validateAdditionalPayByEmployeeId } from './additionalPay.middleware';
import { CreateAdditionalPay } from './additionalPay.model';

const additionalPayRoute = Router({ mergeParams: true });
const additionalPayController = new AdditionalPayController(db);

additionalPayRoute.post(
  '/',
  [
    validateRequest({ body: CreateAdditionalPay }),
    validateAdditionalPayByEmployeeId,
  ],
  additionalPayController.createAdditionalPay.bind(additionalPayController),
);
log.info('POST /additionalPay/ set');

export default additionalPayRoute;
