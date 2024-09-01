import { Router } from 'express';
import { SalaryInformationController } from './salary_information.controller';
import pool from '../../../../drizzle.config';

const salaryInformationRouter = Router({ mergeParams: true });
const controller = new SalaryInformationController(pool);

salaryInformationRouter.post(
  '/',
  controller.createSalaryInformation.bind(controller),
);
salaryInformationRouter.get(
  '/:employeeId',
  controller.getSalaryInformationByEmployeeId.bind(controller),
);
salaryInformationRouter.put(
  '/:id',
  controller.updateSalaryInformationById.bind(controller),
);
salaryInformationRouter.delete(
  '/:id',
  controller.deleteSalaryInformationById.bind(controller),
);

export default salaryInformationRouter;
