import { Router } from 'express';

import log from '../../../../../lib/logger';
import { db } from '../../../../../mysql/mysql.pool';
import { validateRequest } from '../../../../middlewares';

import { EmployeeController } from './employee.controller';
import { Employee, UpdateEmployee } from './employee.model';
import { validateEmployeeId } from './employee.middlewares';
import personalInformationRoute from '../personal_information/personalInformation.route';
import employmentInformationRoute from '../employmentInformation/employmentInformation.route';

const employeeRoute = Router({ mergeParams: true });
const employeeController = new EmployeeController(db);

employeeRoute.get(
  '/',
  employeeController.getAllEmployee.bind(employeeController),
);
log.info('GET /employee set');

employeeRoute.get(
  '/:employee_id',
  validateEmployeeId,
  employeeController.getEmployeeById.bind(employeeController),
);
log.info('GET /employee/:employee_id set');

employeeRoute.post(
  '/',
  validateRequest({
    body: Employee,
  }),
  employeeController.createEmployee.bind(employeeController),
);
log.info('POST /employee set');

employeeRoute.put(
  '/:employee_id',
  [
    validateRequest({
      body: Employee,
    }),
    validateEmployeeId,
  ],
  employeeController.updateEmployee.bind(employeeController),
);
log.info('PUT /employee/:employee_id set');

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
log.info('PATCH /employee set');

employeeRoute.delete(
  '/:employee_id',
  validateEmployeeId,
  employeeController.deleteEmployeeById.bind(employeeController),
);
log.info('DELETE /employee/:employee_id set');

employeeRoute.use(
  '/:employee_id/personalInformation',
  personalInformationRoute,
);
employeeRoute.use(
  '/:employee_id/employmentInformation',
  employmentInformationRoute,
);
export default employeeRoute;
