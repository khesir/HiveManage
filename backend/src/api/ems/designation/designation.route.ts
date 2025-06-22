import { Router } from 'express';
import { DesignationController } from './designation.controller';
import { validateRequest } from '@/src/middlewares';
import { CreateDesignation, UpdateDesignation } from './designation.model';
import { validateDesignationID } from './designation.middlewares';
import { db } from '@/drizzle/pool';

const designationRoute = Router({ mergeParams: true });
const designationController = new DesignationController(db);

designationRoute.get(
  '/',
  designationController.getAllDesignation.bind(designationController),
);

designationRoute.get(
  '/:designation_id',
  validateDesignationID,
  designationController.getDesignationById.bind(designationController),
);

designationRoute.post(
  '/',
  [
    validateRequest({
      body: CreateDesignation,
    }),
  ],
  designationController.createDesignation.bind(designationController),
);

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

designationRoute.delete(
  '/:designation_id',
  validateDesignationID,
  designationController.deleteDesignationById.bind(designationController),
);

export default designationRoute;
