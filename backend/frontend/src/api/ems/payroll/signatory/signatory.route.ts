import { Router } from 'express';
import { SignatoryController } from './signatory.controller';
import { db } from '../../../../../mysql/mysql.pool';
import log from '../../../../../lib/logger';
import { validateRequest } from '../../../../middlewares';
import { CreateSignatory, UpdateSignatory } from './signatory.model';
import {
  validateSignatoryID,
  validateEmployeeID,
} from './signatory.middlewares';

const signatoryRoute = Router({ mergeParams: true });
const controller = new SignatoryController(db);

signatoryRoute.post(
  '/',
  validateRequest({
    body: CreateSignatory,
  }),
  validateEmployeeID,
  controller.createSignatory.bind(controller),
);
log.info('POST /signatory set');

signatoryRoute.get(
  '/',
  validateEmployeeID,
  controller.getSignatoryByID.bind(controller),
);
log.info('GET /signatory/ set');

signatoryRoute.get(
  '/:signatory_id',
  validateSignatoryID,
  controller.getSignatoryByID.bind(controller),
);
log.info('GET /signatory/:signatory_id set');

signatoryRoute.put(
  '/:signatory_id',
  [
    validateRequest({
      body: UpdateSignatory,
    }),
    validateSignatoryID,
    validateEmployeeID,
  ],
  controller.updateSignatory.bind(controller),
);
log.info('PUT /signatory/:signatory_id set');

signatoryRoute.delete(
  '/:signatory_id',
  validateSignatoryID,
  controller.deleteSignatory.bind(controller),
);
log.info('DELETE /signatory/:signatory_id set');

export default signatoryRoute;
