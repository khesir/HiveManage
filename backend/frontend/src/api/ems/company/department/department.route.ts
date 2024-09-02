import { Router } from 'express';
import { DepartmentController } from './department.controller';
import pool from '../../../../../drizzle.config';

const departmentRoute = Router({ mergeParams: true });
const departmentController = new DepartmentController(pool);

departmentRoute.get(
  '/',
  departmentController.getAllDepartments.bind(departmentController),
);
departmentRoute.get(
  '/:id',
  departmentController.getDepartmentById.bind(departmentController),
);

export default departmentRoute;
