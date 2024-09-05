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
  controller.getFinancialIDByEmployeeID.bind(controller),
);
log.info('GET /employeeInformation/:employee_id set');

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
log.info('PUT /employeeInformation/:employee_id set');

export default financiallInformationRoute;
