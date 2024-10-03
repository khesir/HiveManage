import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import log from '@/lib/logger';

import { LeaveRequest, UpdateLeave } from './leaveRequest.model';
import {
  validateEmployeeId,
  validateLeaveRequestId,
} from './leaveRequest.middlewares';
import { LeaveRequestController } from './leaveRequest.controller';
import { db } from '@/drizzle/pool';

const leaveRequestRoute = Router({ mergeParams: true });
const controller = new LeaveRequestController(db);

leaveRequestRoute.get(
  '/',
  validateEmployeeId,
  controller.getAllLeaveRequest.bind(controller),
);
log.info('GET /leaveRequest/ set');

leaveRequestRoute.get(
  '/:leaveRequest_id',
  validateLeaveRequestId,
  controller.getLeaveRequestById.bind(controller),
);
log.info('GET /leaveRequest/:leaveRequest_id set');

leaveRequestRoute.post(
  '/',
  [
    validateRequest({
      body: LeaveRequest,
    }),
    validateEmployeeId,
  ],
  controller.createleaveRequest.bind(controller),
);
log.info('POST /leaveRequest/ set');

leaveRequestRoute.put(
  '/:leaveRequest_id',
  [
    validateRequest({
      body: LeaveRequest,
    }),
    validateEmployeeId,
    validateLeaveRequestId,
  ],
  controller.updateleaveRequest.bind(controller),
);
log.info('PUT /leaveRequest/:leaveRequest_id set');

leaveRequestRoute.patch('/:leaveRequest_id', [
  validateRequest({
    body: UpdateLeave,
  }),
  validateEmployeeId,
  validateLeaveRequestId,
  controller.updateleaveRequest.bind(controller),
]);

leaveRequestRoute.delete(
  '/:leaveRequest_id',
  validateLeaveRequestId,
  controller.deleteleaveRequestById.bind(controller),
);
log.info('DELETE /leaveRequest/:leaveRequest_id set');

export default leaveRequestRoute;
