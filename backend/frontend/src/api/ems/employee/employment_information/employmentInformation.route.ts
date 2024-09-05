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
  controller.getEmploymentIDByEmployeeID.bind(controller),
);
log.info('GET /employmentInformation/:employee_id set');

employmentInformationRoute.put(
  '/:employment_id',
  [
    validateRequest({
      body: EmploymentInformation,
    }),
    validateEmploymentID,
  ],
  controller.updateEmploymentInformation.bind(controller),
);
log.info('PUT /employmentInformation/:employment_id set');

export default employmentInformationRoute;
