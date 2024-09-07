import { Router } from 'express';
import { EmploymentInformationController } from './employmentInformation.controller';
import { db } from '../../../../../mysql/mysql.pool';
import {
  validateEmployeeID,
  validateEmploymentID,
} from './employmentInformation.middlewares';
import { validateRequest } from '../../../../middlewares';
import { EmploymentInformation } from './employmentInformation.model';
import log from '../../../../../lib/logger';

const employmentInformationRoute = Router({ mergeParams: true });
const controller = new EmploymentInformationController(db);

employmentInformationRoute.get(
  '/',
  validateEmployeeID,
  controller.getEmploymentInformation.bind(controller),
);
log.info('GET /employmentInformation/ set');

employmentInformationRoute.get(
  '/:employment_id',
  validateEmploymentID,
  controller.getEmploymentInformation.bind(controller),
);
log.info('GET /employmentInformation/:employee_id set');

employmentInformationRoute.post(
  '/',
  [
    validateRequest({
      body: EmploymentInformation,
    }),
    validateEmployeeID,
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
    validateEmploymentID,
    validateEmployeeID,
  ],
  controller.updateEmploymentInformation.bind(controller),
);
log.info('PUT /employmentInformation/:employment_id set');

employmentInformationRoute.delete(
  '/:employment_id',
  validateEmploymentID,
  controller.deleteEmploymentInformation.bind(controller),
);
log.info('DELETE /employmentInformation/:employment_id set');

export default employmentInformationRoute;
