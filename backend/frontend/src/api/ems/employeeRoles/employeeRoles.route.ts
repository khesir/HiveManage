import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';
import { EmployeeRolesController } from './employeeRoles.controller';
import {
  formDataToObject,
  multerbase,
  validateEmployeeEmail,
  validatEmployeeRoleID,
} from './employeeRoles.middleware';
import {
  CreateEmployeeRoles,
  UpdateEmployeeRoles,
} from './employeeRoles.model';

const employeeRolesRoute = Router({ mergeParams: true });
const employeeRolesController = new EmployeeRolesController(db);

employeeRolesRoute.get(
  '/',
  employeeRolesController.getAllEmployeeAccount.bind(employeeRolesController),
);

employeeRolesRoute.get(
  '/:employee_role_id',
  validatEmployeeRoleID,
  employeeRolesController.getEmployeeAccountById.bind(employeeRolesController),
);

employeeRolesRoute.post(
  '/',
  [
    multerbase.single('employee_profile_link'),
    formDataToObject,
    validateEmployeeEmail,
    validateRequest({ body: CreateEmployeeRoles }),
  ],
  employeeRolesController.createEmployeeAccount.bind(employeeRolesController),
);

employeeRolesRoute.put(
  '/:employee_role_id',
  [validateRequest({ body: UpdateEmployeeRoles }), validatEmployeeRoleID],
  employeeRolesController.updateEmployeeAccount.bind(employeeRolesController),
);
employeeRolesRoute.patch(
  '/:employee_role_id/status',
  validatEmployeeRoleID,
  employeeRolesController.updateStatus.bind(employeeRolesController),
);

employeeRolesRoute.delete(
  '/:employee_role_id',
  validatEmployeeRoleID,
  employeeRolesController.deleteEmployeeAccount.bind(employeeRolesController),
);

export default employeeRolesRoute;
