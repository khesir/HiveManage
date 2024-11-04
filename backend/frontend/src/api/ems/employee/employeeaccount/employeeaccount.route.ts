import { Router } from 'express';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { validateRequest } from '@/src/middlewares';
import { EmployeeAccountController } from './employeeaccount.controller';
import { validateEmployeeAccountID } from './employeeaccount.middleware';
import {
  CreateEmployeeAccount,
  UpdateEmployeeAccount,
} from './employeeaccount.model';

const employeeaccountRoute = Router({ mergeParams: true });
const employeeaccountController = new EmployeeAccountController(db);

employeeaccountRoute.get(
  '/',
  employeeaccountController.getAllEmployeeAccount.bind(
    employeeaccountController,
  ),
);
log.info('GET /employeeaccount set');

employeeaccountRoute.get(
  '/:employee_account_id',
  validateEmployeeAccountID,
  employeeaccountController.getEmployeeAccountById.bind(
    employeeaccountController,
  ),
);
log.info('GET /employeeaccount/:employee_account_id set');

employeeaccountRoute.post(
  '/',
  [validateRequest({ body: CreateEmployeeAccount })],
  employeeaccountController.createEmployeeAccount.bind(
    employeeaccountController,
  ),
);
log.info('POST /employeeaccount/ set ');

employeeaccountRoute.put(
  '/:employee_account_id',
  [validateRequest({ body: UpdateEmployeeAccount }), validateEmployeeAccountID],
  employeeaccountController.updateEmployeeAccount.bind(
    employeeaccountController,
  ),
);
log.info('PUT /employeeaccount/:employee_account_id set ');

employeeaccountRoute.delete(
  '/:employee_account_id',
  validateEmployeeAccountID,
  employeeaccountController.deleteEmployeeAccount.bind(
    employeeaccountController,
  ),
);
log.info('DELETE /employeeaccount/:employee_account_id set');

export default employeeaccountRoute;
