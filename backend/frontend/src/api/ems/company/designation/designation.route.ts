import { Router } from 'express';
import { DesignationController } from './designation.controller';
import { db } from '@/mysql/mysql.pool';
import log from '@/lib/logger';
import { validateRequest } from '@/src/middlewares';
import { CreateDesignation, UpdateDesignation } from './designation.model';
import { validateDesignationID } from './designation.middlewares';

const designationRoute = Router({ mergeParams: true });
const designationController = new DesignationController(db);

designationRoute.get(
  '/',
  designationController.getAllDesignation.bind(designationController),
);
log.info('GET /designation/ set');

designationRoute.get(
  '/:designation_id',
  validateDesignationID,
  designationController.getDesignationById.bind(designationController),
);
log.info('GET /designation/:designation_id set');

designationRoute.post(
  '/',
  [
    validateRequest({
      body: CreateDesignation,
    }),
  ],
  designationController.createDesignation.bind(designationController),
);
log.info('POST /designation/  set');

designationRoute.patch(
  '/:designation_id',
  [
    validateRequest({
      body: UpdateDesignation,
    }),
    validateDesignationID,
  ],
  designationController.updateDesignation.bind(designationController),
);
log.info('PATCH /designation/:designation_id set');

designationRoute.delete(
  '/:designation_id',
  validateDesignationID,
  designationController.deleteDesignationById.bind(designationController),
);
log.info('DELETE /designation/:designation_id set');

export default designationRoute;
