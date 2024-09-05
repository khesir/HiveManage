import { Router } from 'express';
import { db } from '../../../../../mysql/mysql.pool';
import { validateRequest } from '../../../../middlewares';
import log from '../../../../../lib/logger';

import { SalaryInformationController } from './salaryInformation.controller';
import { SalaryInformation } from './salaryInformation.model';
import {
  validateEmployeeID,
  validateSalaryID,
} from './salaryInformation.middlewares';

const salaryInformationRoute = Router({ mergeParams: true });
const controller = new SalaryInformationController(db);

salaryInformationRoute.get(
  '/',
  validateEmployeeID,
  controller.getPersonalIDByEmployeeID.bind(controller),
);
log.info('GET /salaryInformation/:employee_id set');

salaryInformationRoute.put(
  '/:salaryInfo_id',
  [
    validateRequest({
      body: SalaryInformation,
    }),
    validateSalaryID,
  ],
  controller.updatePersonalInformation.bind(controller),
);
log.info('PUT /salaryInformation/:personalInfo_id set');

export default salaryInformationRoute;
