import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
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

assignedEmployeeRoute.get(
  '/:assigned_employee_id',
  validateAssignedEmployeeID,
  assignedEmployeeController.getAssignedEmployeeById.bind(
    assignedEmployeeController,
  ),
);

assignedEmployeeRoute.post(
  '/',
  [validateRequest({ body: CreateAssignedEmployees })],
  assignedEmployeeController.createAssignedEmployee.bind(
    assignedEmployeeController,
  ),
);

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

assignedEmployeeRoute.delete(
  '/:assigned_employee_id',
  validateAssignedEmployeeID,
  assignedEmployeeController.deleteAssignedEmployee.bind(
    assignedEmployeeController,
  ),
);

export default assignedEmployeeRoute;
