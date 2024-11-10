import { Router } from 'express';
import { EmploymentInformationController } from './employmentInformation.controller';
import { db } from '@/drizzle/pool';
import {
  validateEmployeeId,
  validateEmploymentId,
} from './employmentInformation.middlewares';
import { validateRequest } from '@/src/middlewares';
import { EmploymentInformation } from './employmentInformation.model';

const employmentInformationRoute = Router({ mergeParams: true });
const controller = new EmploymentInformationController(db);

employmentInformationRoute.get(
  '/',
  validateEmployeeId,
  controller.getEmploymentInformation.bind(controller),
);

employmentInformationRoute.get(
  '/:employment_id',
  [validateEmploymentId, validateEmployeeId],
  controller.getEmploymentInformation.bind(controller),
);

employmentInformationRoute.post(
  '/',
  [
    validateRequest({
      body: EmploymentInformation,
    }),
    validateEmployeeId,
  ],
  controller.createEmploymentInformation.bind(controller),
);

employmentInformationRoute.put(
  '/:employment_id',
  [
    validateRequest({
      body: EmploymentInformation,
    }),
    validateEmploymentId,
    validateEmployeeId,
  ],
  controller.updateEmploymentInformation.bind(controller),
);

employmentInformationRoute.delete(
  '/:employment_id',
  validateEmploymentId,
  validateEmployeeId,
  controller.deleteEmploymentInformation.bind(controller),
);

export default employmentInformationRoute;
