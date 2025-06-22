import { Router } from 'express';

import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';

import { EmployeeController } from './employee.controller';
import { CreateEmployee, UpdateEmployee } from './employee.model';
import {
  formDataToObject,
  multerbase,
  validateEmployeeId,
} from './employee.middlewares';
import personalInformationRoute from '../personal_information/personalInformation.route';
import employmentInformationRoute from '../employmentInformation/employmentInformation.route';

const employeeRoute = Router({ mergeParams: true });
const employeeController = new EmployeeController(db);

employeeRoute.get(
  '/',
  employeeController.getAllEmployee.bind(employeeController),
);

employeeRoute.get(
  '/:employee_id',
  validateEmployeeId,
  employeeController.getEmployeeById.bind(employeeController),
);

// Very rare case to use
employeeRoute.post(
  '/',
  validateRequest({
    body: CreateEmployee,
  }),
  employeeController.createEmployee.bind(employeeController),
);

employeeRoute.put(
  '/:employee_id',
  [
    multerbase.single('profile_link'),
    formDataToObject,
    validateEmployeeId,
    validateRequest({
      body: UpdateEmployee,
    }),
  ],
  employeeController.updateEmployee.bind(employeeController),
);

employeeRoute.patch(
  '/:employee_id',
  [
    validateRequest({
      body: UpdateEmployee,
    }),
    validateEmployeeId,
  ],
  employeeController.updateEmployee.bind(employeeController),
);

employeeRoute.delete(
  '/:employee_id',
  validateEmployeeId,
  employeeController.deleteEmployeeById.bind(employeeController),
);

// ========================== Sub Modules ==========================
employeeRoute.use(
  '/:employee_id/personalInformation',
  personalInformationRoute,
);
employeeRoute.use(
  '/:employee_id/employmentInformation',
  employmentInformationRoute,
);

export default employeeRoute;
