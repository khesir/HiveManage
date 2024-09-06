import { Router } from 'express';
import { db } from '../../../../../mysql/mysql.pool';
import { validateRequest } from '../../../../middlewares';
import log from '../../../../../lib/logger';

import { LeaveRequest, UpdateLeave } from './leaveRequest.model';
import {
  validateEmployeeID,
  validateLeaveRequestID,
} from './leaveRequest.middlewares';
import { LeaveRequestController } from './leaveRequest.controller';

const leaveRequestRoute = Router({ mergeParams: true });
const controller = new LeaveRequestController(db);

leaveRequestRoute.get(
  '/',
  validateEmployeeID,
  controller.getAllleaveRequest.bind(controller),
);
log.info('GET /leaveRequest/ set');

leaveRequestRoute.get(
  '/:leaveRequest_id',
  validateLeaveRequestID,
  controller.getleaveRequestById.bind(controller),
);
log.info('GET /leaveRequest/:leaveRequest_id set');

leaveRequestRoute.post(
  '/',
  [
    validateRequest({
      body: LeaveRequest,
    }),
    validateEmployeeID,
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
    validateEmployeeID,
    validateLeaveRequestID,
  ],
  controller.updateleaveRequest.bind(controller),
);
log.info('PUT /leaveRequest/:leaveRequest_id set');

leaveRequestRoute.patch('/:leaveRequest_id', [
  validateRequest({
    body: UpdateLeave,
  }),
  validateEmployeeID,
  validateLeaveRequestID,
  controller.updateleaveRequest.bind(controller),
]);

leaveRequestRoute.delete(
  '/:leaveRequest_id',
  validateLeaveRequestID,
  controller.deleteleaveRequestByID.bind(controller),
);
log.info('DELETE /leaveRequest/:leaveRequest_id set');

export default leaveRequestRoute;
