import { Router } from 'express';
import { DepartmentController } from './department.controller';

import { CreateDepartment, UpdateDepartment } from './department.model';
import { validateDepartmentID } from './department.middleware';

import log from '../../../../../lib/logger';
import { db } from '../../../../../mysql/mysql.pool';
import { validateRequest } from '../../../../middlewares';

const departmentRoute = Router({ mergeParams: true });
const departmentController = new DepartmentController(db);

departmentRoute.get(
  '/',
  departmentController.getAllDepartments.bind(departmentController),
);
log.info('GET /department/ set');

departmentRoute.get(
  '/:department_id',
  validateDepartmentID,
  departmentController.getDepartmentById.bind(departmentController),
);
log.info('GET /department/:department_id  set');

departmentRoute.post(
  '/',
  [
    validateRequest({
      body: CreateDepartment,
    }),
  ],
  departmentController.createDepartment.bind(departmentController),
);
log.info('POST /department/  set');

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
log.info('PUT /department/:department_id set');

departmentRoute.delete(
  '/:department_id',
  validateDepartmentID,
  departmentController.deleteDepartmentByID.bind(departmentController),
);
log.info('DELETE /department/:department_id set');

export default departmentRoute;