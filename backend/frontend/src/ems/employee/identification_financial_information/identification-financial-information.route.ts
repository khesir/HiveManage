import { Router } from 'express';
import pool from '../../../../drizzle.config';
import { IdentificationFinancialInformationController } from './identification-financial-information.controller';

const identificationFinancialInformationRouter = Router({ mergeParams: true });
const controller = new IdentificationFinancialInformationController(pool);

identificationFinancialInformationRouter.post(
  '/',
  controller.createIdentificationFinancialInformation.bind(controller),
);
identificationFinancialInformationRouter.get(
  '/:employeeId',
  controller.getIdentificationFinancialInformationByEmployeeId.bind(controller),
);
identificationFinancialInformationRouter.put(
  '/:id',
  controller.updateIdentificationFinancialInformationById.bind(controller),
);
identificationFinancialInformationRouter.delete(
  '/:id',
  controller.deleteIdentificationFinancialInformationById.bind(controller),
);

export default identificationFinancialInformationRouter;
