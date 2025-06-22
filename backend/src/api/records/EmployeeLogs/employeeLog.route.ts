import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { EmployeeLogController } from './employeeLog.controller';
import { CreateEmployeeLog } from './employeeLog.model';

const employeelogRoute = Router({ mergeParams: true });
const employeelogController = new EmployeeLogController(db);

employeelogRoute.get(
  '/',
  employeelogController.getEmployeeLog.bind(employeelogController),
);

employeelogRoute.post(
  '/',
  [validateRequest({ body: CreateEmployeeLog })],
  employeelogController.createEmployeeLog.bind(employeelogController),
);

export default employeelogRoute;
