import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { PersonalInformationController } from './personalInformation.controller';
import { PersonalInformation } from './personalInformation.model';
import {
  validateEmployeeId,
  validatePersonalId,
} from './personalInformation.middlewares';
import { db } from '@/drizzle/pool';

const personalInformationRoute = Router({ mergeParams: true });
const controller = new PersonalInformationController(db);

personalInformationRoute.get(
  '/',
  validateEmployeeId,
  controller.getPersonalInformation.bind(controller),
);

personalInformationRoute.get(
  '/:personalInfo_id',
  validatePersonalId,
  validateEmployeeId,
  controller.getPersonalInformation.bind(controller),
);

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

personalInformationRoute.delete(
  '/:personalInfo_id',
  validatePersonalId,
  validateEmployeeId,
  controller.deleteEmploymentInformation.bind(controller),
);

export default personalInformationRoute;
