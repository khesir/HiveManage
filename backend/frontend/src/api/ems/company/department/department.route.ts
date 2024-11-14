import { Router } from 'express';
import { DepartmentController } from './department.controller';

import { CreateDepartment, UpdateDepartment } from './department.model';
import { validateDepartmentID } from './department.middleware';

import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';

const departmentRoute = Router({ mergeParams: true });
const departmentController = new DepartmentController(db);

departmentRoute.get(
  '/',
  departmentController.getAllDepartments.bind(departmentController),
);

departmentRoute.get(
  '/:department_id',
  validateDepartmentID,
  departmentController.getDepartmentById.bind(departmentController),
);

departmentRoute.post(
  '/',
  [
    validateRequest({
      body: CreateDepartment,
    }),
  ],
  departmentController.createDepartment.bind(departmentController),
);

departmentRoute.patch(
  '/:department_id',
  [
    validateRequest({
      body: UpdateDepartment,
    }),
    validateDepartmentID,
  ],
  departmentController.updateDepartment.bind(departmentController),
);

departmentRoute.delete(
  '/:department_id',
  validateDepartmentID,
  departmentController.deleteDepartmentByID.bind(departmentController),
);

export default departmentRoute;
