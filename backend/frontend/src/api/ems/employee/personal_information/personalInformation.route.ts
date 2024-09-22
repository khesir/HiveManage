import { Router } from 'express';
import { db } from '@/mysql/mysql.pool';
import { validateRequest } from '@/src/middlewares';
import log from '@/lib/logger';
import { PersonalInformationController } from './personalInformation.controller';
import { PersonalInformation } from './personalInformation.model';
import {
  validateEmployeeId,
  validatePersonalId,
} from './personalInformation.middlewares';

const personalInformationRoute = Router({ mergeParams: true });
const controller = new PersonalInformationController(db);

personalInformationRoute.get(
  '/',
  validateEmployeeId,
  controller.getPersonalInformation.bind(controller),
);
log.info('GET /personalInformation/ set');

personalInformationRoute.get(
  '/:personalInfo_id',
  validatePersonalId,
  validateEmployeeId,
  controller.getPersonalInformation.bind(controller),
);
log.info('GET /personalInformation/:personalInfo_id set');

personalInformationRoute.post(
  '/',
  [
    validateRequest({
      body: PersonalInformation,
    }),
    validateEmployeeId,
  ],
  controller.createPersonalInformation.bind(controller),
);
log.info('POST /personalInformation/ set');

personalInformationRoute.put(
  '/:personalInfo_id',
  [
    validateRequest({
      body: PersonalInformation,
    }),
    validatePersonalId,
    validateEmployeeId,
  ],
  controller.updatePersonalInformation.bind(controller),
);
log.info('PUT /personalInformation/:personalInfo_id set');

personalInformationRoute.delete(
  '/:personalInfo_id',
  validatePersonalId,
  validateEmployeeId,
  controller.deleteEmploymentInformation.bind(controller),
);
log.info('DELETE /personalInformation/:personalInfo_id set');

export default personalInformationRoute;
