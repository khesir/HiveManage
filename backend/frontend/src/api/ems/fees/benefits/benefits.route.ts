import { Router } from 'express';

import { db } from '../../../../../mysql/mysql.pool';
import log from '../../../../../lib/logger';
import { validateRequest } from '../../../../../src/middlewares';
import { BenefitsController } from './benefits.controller';
import { CreateBenefits } from './benefits.model';

const benefitRoute = Router({ mergeParams: true });
const benefitController = new BenefitsController(db);

benefitRoute.post(
  '/',
  validateRequest({ body: CreateBenefits }),
  benefitController.createBenefit.bind(benefitController),
);
log.info('POST /benefits/ set');

export default benefitRoute;
