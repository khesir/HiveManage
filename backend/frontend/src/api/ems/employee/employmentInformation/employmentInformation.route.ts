import { Router } from 'express';
import { EmploymentInformationController } from './employmentInformation.controller';
import { db } from '@/drizzle/pool';
import {
  validateEmployeeId,
  validateEmploymentId,
} from './employmentInformation.middlewares';
import { validateRequest } from '@/src/middlewares';
import { EmploymentInformation } from './employmentInformation.model';
import log from '@/lib/logger';

const employmentInformationRoute = Router({ mergeParams: true });
const controller = new EmploymentInformationController(db);

employmentInformationRoute.get(
  '/',
  validateEmployeeId,
  controller.getEmploymentInformation.bind(controller),
);
log.info('GET /employmentInformation/ set');

employmentInformationRoute.get(
  '/:employment_id',
  [validateEmploymentId, validateEmployeeId],
  controller.getEmploymentInformation.bind(controller),
);
log.info('GET /employmentInformation/:employee_id set');

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
log.info('POST /employmentInformation set');

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
log.info('PUT /employmentInformation/:employment_id set');

employmentInformationRoute.delete(
  '/:employment_id',
  validateEmploymentId,
  validateEmployeeId,
  controller.deleteEmploymentInformation.bind(controller),
);
log.info('DELETE /employmentInformation/:employment_id set');

export default employmentInformationRoute;
