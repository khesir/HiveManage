import { Router } from 'express';
import { EmployeeController } from './employee.controller';

const employeeRoute = Router();
const employeeController = new EmployeeController();

employeeRoute.post('/employees', employeeController.createEmployee.bind(employeeController));
employeeRoute.get('/employees', employeeController.getAllEmployees.bind(employeeController));
employeeRoute.get('/employees/:id', employeeController.getEmployeeById.bind(employeeController));
employeeRoute.put('/employees/:id', employeeController.updateEmployee.bind(employeeController));
employeeRoute.delete('/employees/:id', employeeController.deleteEmployee.bind(employeeController));

export default employeeRoute;