import { Router } from 'express';

import { EmployeeController } from './employee.controller';
import pool from '../../../config/mysql.config';

import employmentInformationRoute from './employment_information/employment-information.route';
import salaryInformationRouter from './salary_information/salary_information.route';
import personalInformationRouter from './personal_information/personal-information.route';
import identificationFinancialInformationRouter from './identification_financial_information/identification-financial-information.route';
import leaveLimitRouter from './leave_limit/leave-limit.route';
import emsRoute from '../ems.route';

const employeeRoute = Router({mergeParams: true});
const employeeController = new EmployeeController(pool);

employeeRoute.post('/', employeeController.createEmployee.bind(employeeController));
employeeRoute.get('/', employeeController.getAllEmployees.bind(employeeController));
employeeRoute.get('/:id', employeeController.getEmployeeById.bind(employeeController));
employeeRoute.put('/:id', employeeController.updateEmployee.bind(employeeController));
employeeRoute.delete('/:id', employeeController.deleteEmployee.bind(employeeController));


emsRoute.use('/employee', employeeRoute)
emsRoute.use('/employmentInformation', employmentInformationRoute)
emsRoute.use('/salaryInformation', salaryInformationRouter)
emsRoute.use('/personalInformation', personalInformationRouter)
emsRoute.use('/idenficationFinancialInformation', identificationFinancialInformationRouter)
emsRoute.use('/leaveLimit', leaveLimitRouter)


export default employeeRoute;