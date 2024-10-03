import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';
import log from '@/lib/logger';

import { SalaryInformationController } from './salaryInformation.controller';
import { SalaryInformation } from './salaryInformation.model';
import {
  validateEmployeeId,
  validateSalaryId,
} from './salaryInformation.middlewares';

const salaryInformationRoute = Router({ mergeParams: true });
const controller = new SalaryInformationController(db);

salaryInformationRoute.get(
  '/',
  validateEmployeeId,
  controller.getSalaryInformation.bind(controller),
);
log.info('GET /salaryInformation/ set');

salaryInformationRoute.get(
  '/:salaryInfo_id',
  [validateSalaryId, validateEmployeeId],
  controller.getSalaryInformation.bind(controller),
);
log.info('GET /salaryInformation/:employee_id set');

salaryInformationRoute.post(
  '/',
  [
    validateRequest({
      body: SalaryInformation,
    }),
    validateEmployeeId,
  ],
  controller.createSalaryInformation.bind(controller),
);
log.info('POST /salaryInformation/ set');

salaryInformationRoute.put(
  '/:salaryInfo_id',
  [
    validateRequest({
      body: SalaryInformation,
    }),
    validateSalaryId,
    validateEmployeeId,
  ],
  controller.updateSalaryInformation.bind(controller),
);
log.info('PUT /salaryInformation/:personalInfo_id set');

salaryInformationRoute.delete(
  '/:salaryInfo_id',
  [validateSalaryId, validateEmployeeId],
  controller.deleteSalaryInformation.bind(controller),
);
log.info('DELETE /salaryInformation/:personalInfo_id set');

export default salaryInformationRoute;
