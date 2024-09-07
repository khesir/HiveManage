import { Router } from 'express';
import { db } from '../../../../../mysql/mysql.pool';
import { validateRequest } from '../../../../middlewares';
import log from '../../../../../lib/logger';
import { PersonalInformationController } from './personalInformation.controller';
import { PersonalInformation } from './personalInformation.model';
import {
  validateEmployeeID,
  validatePersonalID,
} from './personalInformation.middlewares';

const personalInformationRoute = Router({ mergeParams: true });
const controller = new PersonalInformationController(db);

personalInformationRoute.get(
  '/',
  validateEmployeeID,
  controller.getPersonalInformation.bind(controller),
);
log.info('GET /personalInformation/ set');

personalInformationRoute.get(
  '/:personalInfo_id',
  validatePersonalID,
  controller.getPersonalInformation.bind(controller),
);
log.info('GET /personalInformation/:personalInfo_id set');

personalInformationRoute.post(
  '/',
  [
    validateRequest({
      body: PersonalInformation,
    }),
    validateEmployeeID,
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
    validatePersonalID,
    validateEmployeeID,
  ],
  controller.updatePersonalInformation.bind(controller),
);
log.info('PUT /personalInformation/:personalInfo_id set');

personalInformationRoute.delete(
  '/:personalInfo_id',
  validatePersonalID,
  controller.deleteEmploymentInformation.bind(controller),
);
log.info('DELETE /personalInformation/:personalInfo_id set');

export default personalInformationRoute;
