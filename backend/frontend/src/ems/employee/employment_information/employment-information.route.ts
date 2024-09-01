import { Router } from 'express';
import { EmploymentInformationController } from './employment-information.controller';
import pool from '../../../../drizzle.config';

const employmentInformationRoute = Router({ mergeParams: true });
const controller = new EmploymentInformationController(pool);

employmentInformationRoute.post(
  '/',
  controller.createEmploymentInformation.bind(controller),
);
employmentInformationRoute.get(
  '/:employeeId',
  controller.getEmploymentInformationByEmployeeId.bind(controller),
);
employmentInformationRoute.put(
  '/:id',
  controller.updateEmploymentInformationById.bind(controller),
);
employmentInformationRoute.delete(
  '/:id',
  controller.deleteEmploymentInformationById.bind(controller),
);

export default employmentInformationRoute;
