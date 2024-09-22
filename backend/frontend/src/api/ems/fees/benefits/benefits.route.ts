import { Router } from 'express';

import { db } from '@/mysql/mysql.pool';
import log from '@/lib/logger';
import { validateRequest } from '@/src/middlewares';
import { BenefitsController } from './benefits.controller';
import { CreateBenefits, UpdateBenefits } from './benefits.model';
import {
  validateBenefitByEmployeeId,
  validateBenefitId,
} from './benefits.middleware';

const benefitRoute = Router({ mergeParams: true });
const benefitController = new BenefitsController(db);

benefitRoute.post(
  '/',
  [validateRequest({ body: CreateBenefits }), validateBenefitByEmployeeId],
  benefitController.createBenefit.bind(benefitController),
);
log.info('POST /benefits/ set');

benefitRoute.patch(
  '/:benefits_id',
  [validateRequest({ body: UpdateBenefits }), validateBenefitByEmployeeId],
  benefitController.updateBenefit.bind(benefitController),
);
log.info('PATCH /benefits/benefits_id set');

benefitRoute.get('/', benefitController.getAllBenefits.bind(benefitController));
log.info('GET /benefits set');

benefitRoute.get(
  '/:benefits_id',
  validateBenefitId,
  benefitController.getBenefitsById.bind(benefitController),
);
log.info('GET /benefits/:benefits_id set ');

benefitRoute.delete(
  '/:benefits_id',
  validateBenefitId,
  benefitController.deleteBenefitsById.bind(benefitController),
);
log.info('DELETE /payroll/:payroll_id set');

export default benefitRoute;
