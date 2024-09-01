import { Router } from 'express';
import pool from '../../../../drizzle.config';
import { PersonalInformationController } from './personal-information.controller';

const personalInformationRouter = Router({ mergeParams: true });
const controller = new PersonalInformationController(pool);

personalInformationRouter.post(
  '/',
  controller.createPersonalInformation.bind(controller),
);
personalInformationRouter.get(
  '/:employeeId',
  controller.getPersonalInformationByEmployeeId.bind(controller),
);
personalInformationRouter.put(
  '/:id',
  controller.updatePersonalInformationById.bind(controller),
);
personalInformationRouter.delete(
  '/:id',
  controller.deletePersonalInformationById.bind(controller),
);

export default personalInformationRouter;
