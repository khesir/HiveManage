import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { EmployeeRoleController } from './roles.controller';
import { validateEmployeeRoleID } from './roles.middleware';
import { CreateEmployeeRole, UpdateEmployeeRole } from './roles.model';

const employeeroleRoute = Router({ mergeParams: true });
const employeeroleController = new EmployeeRoleController(db);

employeeroleRoute.get(
  '/',
  employeeroleController.getAllEmployeeRole.bind(employeeroleController),
);

employeeroleRoute.get(
  '/:roles_id',
  validateEmployeeRoleID,
  employeeroleController.getEmployeeRoleById.bind(employeeroleController),
);

employeeroleRoute.patch(
  '/:roles_id',
  [validateRequest({ body: CreateEmployeeRole })],
  employeeroleController.createEmployeeRole.bind(employeeroleController),
);

employeeroleRoute.put(
  '/:roles_id',
  [validateRequest({ body: UpdateEmployeeRole }), validateEmployeeRoleID],
  employeeroleController.updateEmployeeRole.bind(employeeroleController),
);

employeeroleRoute.delete(
  '/:roles_id',
  validateEmployeeRoleID,
  employeeroleController.deleteEmployeeRole.bind(employeeroleController),
);

export default employeeroleRoute;
