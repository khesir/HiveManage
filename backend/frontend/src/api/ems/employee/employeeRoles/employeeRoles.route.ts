import { Router } from 'express';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { validateRequest } from '@/src/middlewares';
import { EmployeeRolesController } from './employeeaccount.controller';
import { validateEmployeeAccountID } from './employeeaccount.middleware';
import {
  CreateEmployeeRoles,
  UpdateEmployeeRoles,
} from './employeeaccount.model';

const employeeRolesRoute = Router({ mergeParams: true });
const employeeRolesController = new EmployeeRolesController(db);

employeeRolesRoute.get(
  '/',
  employeeRolesController.getAllEmployeeAccount.bind(employeeRolesController),
);
log.info('GET /employeeaccount set');

employeeRolesRoute.get(
  '/:employee_role_id',
  validateEmployeeAccountID,
  employeeRolesController.getEmployeeAccountById.bind(employeeRolesController),
);
log.info('GET /employeeaccount/:employee_role_id set');

employeeRolesRoute.post(
  '/',
  [validateRequest({ body: CreateEmployeeRoles })],
  employeeRolesController.createEmployeeAccount.bind(employeeRolesController),
);
log.info('POST /employeeaccount/ set ');

employeeRolesRoute.put(
  '/:employee_role_id',
  [validateRequest({ body: UpdateEmployeeRoles }), validateEmployeeAccountID],
  employeeRolesController.updateEmployeeAccount.bind(employeeRolesController),
);
log.info('PUT /employeeaccount/:employee_role_id set ');

employeeRolesRoute.delete(
  '/:employee_role_id',
  validateEmployeeAccountID,
  employeeRolesController.deleteEmployeeAccount.bind(employeeRolesController),
);
log.info('DELETE /employeeaccount/:employee_role_id set');

export default employeeRolesRoute;
