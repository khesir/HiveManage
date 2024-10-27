import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { EmployeeRoleController } from './employeerole.controller';
import { validateEmployeeRoleID } from './employeerole.middleware';
import { CreateEmployeeRole, UpdateEmployeeRole } from './employeerole.model';

const employeeroleRoute = Router({ mergeParams: true });
const employeeroleController = new EmployeeRoleController(db);

employeeroleRoute.get(
  '/',
  employeeroleController.getAllEmployeeRole.bind(employeeroleController),
);
log.info('GET /employeeRole set');

employeeroleRoute.get(
  '/:employee_role_id',
  validateEmployeeRoleID,
  employeeroleController.getEmployeeRoleById.bind(employeeroleController),
);
log.info('GET /employeeRole/:employee_role_id set');

employeeroleRoute.patch(
  '/:employee_role_id',
  [validateRequest({ body: CreateEmployeeRole })],
  employeeroleController.createEmployeeRole.bind(employeeroleController),
);
log.info('POST /employeeRole/ set ');

employeeroleRoute.put(
  '/:employee_role_id',
  [validateRequest({ body: UpdateEmployeeRole }), validateEmployeeRoleID],
  employeeroleController.updateEmployeeRole.bind(employeeroleController),
);
log.info('PUT /employeeRole/:employee_role_id set ');

employeeroleRoute.delete(
  '/:employee_role_id',
  validateEmployeeRoleID,
  employeeroleController.deleteEmployeeRole.bind(employeeroleController),
);
log.info('DELETE /employeeRole/:employee_role_id set');

export default employeeroleRoute;
