import { Router } from 'express';
import { FinancialInformationController } from './financialInformation.controller';
import { db } from '../../../../../mysql/mysql.pool';
import { validateRequest } from '../../../../middlewares';
import { FinancialInformation } from './financialInformation.model';
import {
  validateEmployeeID,
  validateFinancialID,
} from './financialInformation.middleware';
import log from '../../../../../lib/logger';

const financiallInformationRoute = Router({ mergeParams: true });
const controller = new FinancialInformationController(db);

financiallInformationRoute.get(
  '/',
  validateEmployeeID,
  controller.getFinancialInformation.bind(controller),
);
log.info('GET /employeeInformation/ set');

financiallInformationRoute.get(
  '/:financial_id',
  validateFinancialID,
  controller.getFinancialInformation.bind(controller),
);
log.info('GET /employeeInformation/:financial_id set');

financiallInformationRoute.put(
  '/:financial_id',
  [
    validateRequest({
      body: FinancialInformation,
    }),
    validateFinancialID,
  ],
  controller.updateFinancialInformation.bind(controller),
);
log.info('PUT /employeeInformation/:financial_id set');

financiallInformationRoute.delete(
  '/:financial_id',
  validateFinancialID,
  controller.deleteEmploymentInformation.bind(controller),
);

export default financiallInformationRoute;
