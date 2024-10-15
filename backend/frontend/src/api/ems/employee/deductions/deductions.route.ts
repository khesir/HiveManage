import { Router } from 'express';

import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { validateRequest } from '@/src/middlewares';
import { DeductionsController } from './deductions.controller';
import { CreateDeductions, UpdateDeductions } from './deductions.model';
import {
  validateDeductionsByEmployeeId,
  validateDeductionsId,
} from './deductions.middleware';

const deductionRoute = Router({ mergeParams: true });
const deductionsController = new DeductionsController(db);

deductionRoute.post(
  '/',
  [validateRequest({ body: CreateDeductions }), validateDeductionsByEmployeeId],
  deductionsController.createDeductions.bind(deductionsController),
);
log.info('POST /deductions/ set');

deductionRoute.put(
  '/:deduction_id',
  [validateRequest({ body: UpdateDeductions }), validateDeductionsId],
  deductionsController.updateDeductions.bind(deductionsController),
);
log.info('PUT /deductions/deduction_id set');

deductionRoute.get(
  '/',
  validateDeductionsByEmployeeId,
  deductionsController.getDeductions.bind(deductionsController),
);
log.info('GET /benefit set');

deductionRoute.get(
  '/:deduction_id',
  [validateDeductionsByEmployeeId, validateDeductionsId],
  deductionsController.getDeductionsById.bind(deductionsController),
);
log.info('GET /deductions/:deduction_id set');

deductionRoute.delete(
  '/:deduction_id',
  validateDeductionsId,
  deductionsController.deleteDeductionsById.bind(deductionsController),
);
log.info('DELETE /deduction/:deduction_id set');

export default deductionRoute;
