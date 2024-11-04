import { Router } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';

import { EmployeeController } from './employee.controller';
import { Employee, UpdateEmployee } from './employee.model';
import { validateEmployeeId } from './employee.middlewares';
import personalInformationRoute from '../personal_information/personalInformation.route';
import employmentInformationRoute from '../employmentInformation/employmentInformation.route';
import financiallInformationRoute from '../financialInformation/financialInformation.route';
import salaryInformationRoute from '../salary_information/salaryInformation.route';
import benefitRoute from '../benefits/benefits.route';
import deductionRoute from '../deductions/deductions.route';
import additionalPayRoute from '../additional_pay/additionalPay.route';
import adjustmentsRoute from '../adjustments/adjustments.route';
import employeeaccountRoute from '../employeeaccount/employeeaccount.route';

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

employeeRoute.use(
  '/:employee_id/financialInformation',
  financiallInformationRoute,
);

employeeRoute.use('/:employee_id/salaryInformation', salaryInformationRoute);
employeeRoute.use('/:employee_id/benefits', benefitRoute);
employeeRoute.use('/:employee_id/deductions', deductionRoute);
employeeRoute.use('/:employee_id/additionalPays', additionalPayRoute);
employeeRoute.use('/:employee_id/adjustments', adjustmentsRoute);
employeeRoute.use('/:employee_id/employeeaccount', employeeaccountRoute);

export default employeeRoute;
