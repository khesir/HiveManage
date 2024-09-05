import { Router } from 'express';

import log from '../../../../../lib/logger';
import { db } from '../../../../../mysql/mysql.pool';
import { validateRequest } from '../../../../middlewares';

import { EmployeeController } from './employee.controller';
import { Employee, UpdateEmployee } from './employee.model';
import { validateEmployeeID } from './employee.middlewares';

// import employmentInformationRoute from '../employment_information/employment-information.route';
// import salaryInformationRouter from '../salary_information/salary_information.route';
// import personalInformationRouter from '../personal_information/personal-information.route';
// import identificationFinancialInformationRouter from '../identification_financial_information/identification-financial-information.route';

const employeeRoute = Router({ mergeParams: true });
const employeeController = new EmployeeController(db);

employeeRoute.get(
  '/',
  employeeController.getAllEmployee.bind(employeeController),
);
log.info('GET /employee set');

employeeRoute.get(
  '/:employee_id',
  validateEmployeeID,
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
    validateEmployeeID,
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
    validateEmployeeID,
  ],
  employeeController.updateEmployee.bind(employeeController),
);
log.info('PATCH /employee set');

employeeRoute.delete(
  '/:employee_id',
  validateEmployeeID,
  employeeController.deleteEmployeeByID.bind(employeeController),
);
log.info('DELETE /employee/:employee_id set');

// ============================ NESTED ROUTE ===========================
// employeeRoute.use('/employmentInformation', employmentInformationRoute);
// log.info('ROUTE /employmentInformation set');

// employeeRoute.use('/salaryInformation', salaryInformationRouter);
// log.info('ROUTE /salaryInformation set');

// employeeRoute.use('/personalInformation', personalInformationRouter);
// log.info('ROUTE /personalInformation set');

// employeeRoute.use(
//   '/financialInformation',
//   identificationFinancialInformationRouter,
// );
// log.info('ROUTE /financialInformation set');

export default employeeRoute;
