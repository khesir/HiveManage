import { Router } from 'express';

import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';

import { EmployeeController } from './employee.controller';
import { CreateEmployee, UpdateEmployee } from './employee.model';
import { validateEmployeeId } from './employee.middlewares';
import personalInformationRoute from '../personal_information/personalInformation.route';
import employmentInformationRoute from '../employmentInformation/employmentInformation.route';
import financiallInformationRoute from '../financialInformation/financialInformation.route';
import salaryInformationRoute from '../salary_information/salaryInformation.route';
import benefitRoute from '../benefits/benefits.route';
import deductionRoute from '../deductions/deductions.route';
import additionalPayRoute from '../additional_pay/additionalPay.route';
import adjustmentsRoute from '../adjustments/adjustments.route';

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
    validateRequest({
      body: CreateEmployee,
    }),
    validateEmployeeId,
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

employeeRoute.use(
  '/:employee_id/financialInformation',
  financiallInformationRoute,
);

employeeRoute.use('/:employee_id/salaryInformation', salaryInformationRoute);
employeeRoute.use('/:employee_id/benefits', benefitRoute);
employeeRoute.use('/:employee_id/deductions', deductionRoute);
employeeRoute.use('/:employee_id/additionalPays', additionalPayRoute);
employeeRoute.use('/:employee_id/adjustments', adjustmentsRoute);

export default employeeRoute;
