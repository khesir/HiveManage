import { Router } from 'express';

import { db } from '../../../../../mysql/mysql.pool';
import log from '../../../../../lib/logger';
import { AdjustmentsController } from './adjustments.controller';
import { validateRequest } from '../../../../../src/middlewares';
import { CreateAdjustments } from './adjustments.model';
import { validateAdjustmentsByEmployeeId } from './adjustments.middleware';

const adjustmentsRoute = Router({ mergeParams: true });
const adjustmentsController = new AdjustmentsController(db);

adjustmentsRoute.post(
  '/',
  [
    validateRequest({ body: CreateAdjustments }),
    validateAdjustmentsByEmployeeId,
  ],
  adjustmentsController.createAdjustments.bind(adjustmentsController),
);
log.info('POST /adjustments/ set');

export default adjustmentsRoute;
