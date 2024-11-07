import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { EmployeeRoleController } from './roles.controller';
import { validateEmployeeRoleID } from './roles.middleware';
import { CreateEmployeeRole, UpdateEmployeeRole } from './roles.model';

const employeeroleRoute = Router({ mergeParams: true });
const employeeroleController = new EmployeeRoleController(db);

employeeroleRoute.get(
  '/',
  employeeroleController.getAllEmployeeRole.bind(employeeroleController),
);
log.info('GET /employeeRole set');

employeeroleRoute.get(
  '/:roles_id',
  validateEmployeeRoleID,
  employeeroleController.getEmployeeRoleById.bind(employeeroleController),
);
log.info('GET /employeeRole/:roles_id set');

employeeroleRoute.patch(
  '/:roles_id',
  [validateRequest({ body: CreateEmployeeRole })],
  employeeroleController.createEmployeeRole.bind(employeeroleController),
);
log.info('POST /employeeRole/ set ');

employeeroleRoute.put(
  '/:roles_id',
  [validateRequest({ body: UpdateEmployeeRole }), validateEmployeeRoleID],
  employeeroleController.updateEmployeeRole.bind(employeeroleController),
);
log.info('PUT /employeeRole/:roles_id set ');

employeeroleRoute.delete(
  '/:roles_id',
  validateEmployeeRoleID,
  employeeroleController.deleteEmployeeRole.bind(employeeroleController),
);
log.info('DELETE /employeeRole/:roles_id set');

export default employeeroleRoute;
