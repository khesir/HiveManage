import { Router } from 'express';
import { FinancialInformationController } from './financialInformation.controller';
import { db } from '@/mysql/mysql.pool';
import { validateRequest } from '@/src/middlewares';
import { FinancialInformation } from './financialInformation.model';
import {
  validateEmployeeId,
  validateFinancialId,
} from './financialInformation.middleware';
import log from '@/lib/logger';

const financiallInformationRoute = Router({ mergeParams: true });
const controller = new FinancialInformationController(db);

financiallInformationRoute.get(
  '/',
  validateEmployeeId,
  controller.getFinancialInformation.bind(controller),
);
log.info('GET /employeeInformation/ set');

financiallInformationRoute.get(
  '/:financial_id',
  validateFinancialId,
  validateEmployeeId,
  controller.getFinancialInformation.bind(controller),
);
log.info('GET /employeeInformation/:financial_id set');

financiallInformationRoute.post(
  '/',
  [
    validateRequest({
      body: FinancialInformation,
    }),
    validateEmployeeId,
    validateEmployeeId,
  ],
  controller.createFinancialInformation.bind(controller),
);
log.info('POST /employmentInformation set');

financiallInformationRoute.put(
  '/:financial_id',
  [
    validateRequest({
      body: FinancialInformation,
    }),
    validateFinancialId,
    validateEmployeeId,
  ],
  controller.updateFinancialInformation.bind(controller),
);
log.info('PUT /employeeInformation/:financial_id set');

financiallInformationRoute.delete(
  '/:financial_id',
  validateFinancialId,
  validateEmployeeId,
  controller.deleteEmploymentInformation.bind(controller),
);

export default financiallInformationRoute;
