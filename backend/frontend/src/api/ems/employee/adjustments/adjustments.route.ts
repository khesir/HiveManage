import { Router } from 'express';

import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { AdjustmentsController } from './adjustments.controller';
import { validateRequest } from '@/src/middlewares';
import { CreateAdjustments, UpdateAdjustments } from './adjustments.model';
import {
  validateAdjustmentsByEmployeeId,
  validateAdjustmentsId,
} from './adjustments.middleware';

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

adjustmentsRoute.put(
  '/:adjustments_id',
  [
    validateRequest({ body: UpdateAdjustments }),
    validateAdjustmentsId,
    validateAdjustmentsByEmployeeId,
  ],
  adjustmentsController.updateAdjustments.bind(adjustmentsController),
);
log.info('PUT /adjustments/adjustments_id set');

adjustmentsRoute.get(
  '/',
  validateAdjustmentsByEmployeeId,
  adjustmentsController.getAllAdjustments.bind(adjustmentsController),
);
log.info('GET /adjustments set');

adjustmentsRoute.get(
  '/:adjustments_id',
  [validateAdjustmentsId, validateAdjustmentsByEmployeeId],
  adjustmentsController.getAdjustmentsById.bind(adjustmentsController),
);
log.info('GET /adjustments/:adjustments_id set');

adjustmentsRoute.delete(
  '/:adjustments_id',
  [validateAdjustmentsId, validateAdjustmentsByEmployeeId],
  adjustmentsController.deleteAdjustmentsById.bind(adjustmentsController),
);
log.info('DELETE /adjustments/:adjustments_id set');

export default adjustmentsRoute;
