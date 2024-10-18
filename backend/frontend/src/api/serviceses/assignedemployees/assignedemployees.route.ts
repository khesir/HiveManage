import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { AssignedEmployeeController } from './assignedemployees.controller';
import { validateAssignedEmployeeID } from './assignedemployees.middleware';
import {
  CreateAssignedEmployees,
  UpdateAssignedEmployees,
} from './assignedemployees.model';

const assignedEmployeeRoute = Router({ mergeParams: true });
const assignedEmployeeController = new AssignedEmployeeController(db);

assignedEmployeeRoute.get(
  '/',
  assignedEmployeeController.getAllAssignedEmployee.bind(
    assignedEmployeeController,
  ),
);
log.info('GET /assignedemployee set');

assignedEmployeeRoute.get(
  '/:assigned_employee_id',
  validateAssignedEmployeeID,
  assignedEmployeeController.getAssignedEmployeeById.bind(
    assignedEmployeeController,
  ),
);
log.info('GET /assignedemployee/:assigned_employee_id set');

assignedEmployeeRoute.post(
  '/',
  [validateRequest({ body: CreateAssignedEmployees })],
  assignedEmployeeController.createAssignedEmployee.bind(
    assignedEmployeeController,
  ),
);
log.info('POST /assignedemployee/ set ');

assignedEmployeeRoute.put(
  '/:assigned_employee_id',
  [
    validateRequest({ body: UpdateAssignedEmployees }),
    validateAssignedEmployeeID,
  ],
  assignedEmployeeController.updateAssignedEmployee.bind(
    assignedEmployeeController,
  ),
);
log.info('PUT /assignedemployee/:assigned_employee_id set ');

assignedEmployeeRoute.delete(
  '/:assigned_employee_id',
  validateAssignedEmployeeID,
  assignedEmployeeController.deleteAssignedEmployee.bind(
    assignedEmployeeController,
  ),
);
log.info('DELETE /assignedemployee/:assigned_employee_id set');

export default assignedEmployeeRoute;
