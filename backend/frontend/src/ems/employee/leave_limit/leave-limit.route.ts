import { Router } from 'express';
import pool from '../../../../config/mysql.config';
import { LeaveLimitController } from './leave-limit.controller';

const leaveLimitRouter = Router({ mergeParams: true });
const controller = new LeaveLimitController(pool);

leaveLimitRouter.post('/', controller.createLeaveLimit.bind(controller));
leaveLimitRouter.get(
  '/:employeeId',
  controller.getLeaveLimitByEmployeeId.bind(controller),
);
leaveLimitRouter.put('/:id', controller.updateLeaveLimitById.bind(controller));
leaveLimitRouter.delete(
  '/:id',
  controller.deleteLeaveLimitById.bind(controller),
);

export default leaveLimitRouter;
