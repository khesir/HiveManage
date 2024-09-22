import { Router } from 'express';
import { db } from '@/mysql/mysql.pool';
import { validateRequest } from '@/src/middlewares';
import log from '@/lib/logger';

import { CreateLeaveLimit, UpdateLeaveLimit } from './leaveLimit.model';
import {
  validateEmployeeID,
  validateLeaveLimitID,
} from './leaveLimit.middlewares';
import { LeaveLimitController } from './leaveLimit.controller';

const leaveLimitRoute = Router({ mergeParams: true });
const controller = new LeaveLimitController(db);

leaveLimitRoute.get(
  '/',
  validateEmployeeID,
  controller.getAllleaveLimit.bind(controller),
);
log.info('GET /leaveLimit/ set');

leaveLimitRoute.get(
  '/:leaveLimit_id',
  validateLeaveLimitID,
  controller.getleaveLimitById.bind(controller),
);
log.info('GET /leaveLimit/:leaveLimit_id set');

leaveLimitRoute.post(
  '/',
  [
    validateRequest({
      body: CreateLeaveLimit,
    }),
    validateEmployeeID,
  ],
  controller.createleaveLimit.bind(controller),
);
log.info('POST /leaveLimit/ set');

leaveLimitRoute.patch(
  '/:leaveLimit_id',
  [
    validateRequest({
      body: UpdateLeaveLimit,
    }),
    validateEmployeeID,
    validateLeaveLimitID,
  ],
  controller.updateleaveLimit.bind(controller),
);
log.info('PUT /leaveLimit/:leaveLimit_id set');

leaveLimitRoute.delete(
  '/:leaveLimit_id',
  validateLeaveLimitID,
  controller.deleteleaveLimitByID.bind(controller),
);
log.info('DELETE /leaveLimit/:leaveLimit_id set');

export default leaveLimitRoute;
