import { Router } from 'express';

import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { validateRequest } from '@/src/middlewares';
import { AdditionalPayController } from './additionalPay.controller';
import {
  validateAdditionalPayByEmployeeId,
  validateAdditionalPayId,
} from './additionalPay.middleware';
import {
  CreateAdditionalPay,
  UpdateAdditionalPay,
} from './additionalPay.model';

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

additionalPayRoute.patch(
  '/:additional_pay_id',
  [validateRequest({ body: UpdateAdditionalPay }), validateAdditionalPayId],
  additionalPayController.updateAdditionalPay.bind(additionalPayController),
);
log.info('PATCH /additionalPay/additional_pay_id set');

additionalPayRoute.get(
  '/',
  additionalPayController.getAdditionalPay.bind(additionalPayController),
);
log.info('GET /additionalPay set');

additionalPayRoute.get(
  '/:additional_pay_id',
  validateAdditionalPayId,
  additionalPayController.getAdditionalPayById.bind(additionalPayController),
);
log.info('GET /additionalPay/:additional_pay_id set');

additionalPayRoute.delete(
  '/:additional_pay_id',
  validateAdditionalPayId,
  additionalPayController.deleteAdditionalPayById.bind(additionalPayController),
);
log.info('DELETE /additionalPay/:additional_pay_id set');

export default additionalPayRoute;
