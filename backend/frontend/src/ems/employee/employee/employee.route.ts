import { Router } from 'express';

import { EmployeeController } from './employee.controller';
import pool from '../../../../drizzle.config';

import employmentInformationRoute from '../employment_information/employment-information.route';
import salaryInformationRouter from '../salary_information/salary_information.route';
import personalInformationRouter from '../personal_information/personal-information.route';
import identificationFinancialInformationRouter from '../identification_financial_information/identification-financial-information.route';
import leaveLimitRouter from '../../company/leave_limit/leave-limit.route';

const employeeRoute = Router({ mergeParams: true });
const employeeController = new EmployeeController(pool);

employeeRoute.post(
  '/',
  employeeController.createEmployee.bind(employeeController),
);
employeeRoute.get(
  '/',
  employeeController.getAllEmployees.bind(employeeController),
);
employeeRoute.get(
  '/:id',
  employeeController.getEmployeeById.bind(employeeController),
);
employeeRoute.put(
  '/:id',
  employeeController.updateEmployee.bind(employeeController),
);
employeeRoute.delete(
  '/:id',
  employeeController.deleteEmployee.bind(employeeController),
);

employeeRoute.use('/employmentInformation', employmentInformationRoute);
employeeRoute.use('/salaryInformation', salaryInformationRouter);
employeeRoute.use('/personalInformation', personalInformationRouter);
employeeRoute.use(
  '/idenficationFinancialInformation',
  identificationFinancialInformationRouter,
);
employeeRoute.use('/leaveLimit', leaveLimitRouter);

export default employeeRoute;
