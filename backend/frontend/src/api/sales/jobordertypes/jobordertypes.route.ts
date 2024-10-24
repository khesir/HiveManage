import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { validateJobOrderTypesID } from './jobordertypes.middleware';
import {
  CreateJobOrderTypes,
  UpdateJobOrderTypes,
} from './jobordertypes.model';
import { JobOrderTypesController } from './jobordertypes.controller';

const jobordertypesRoute = Router({ mergeParams: true });
const jobordertypesController = new JobOrderTypesController(db);

jobordertypesRoute.get(
  '/',
  jobordertypesController.getAllJobOrderTypes.bind(jobordertypesController),
);
log.info('GET /JobOrderTypes set');

jobordertypesRoute.get(
  '/:joborder_type_id',
  validateJobOrderTypesID,
  jobordertypesController.getJobOrderById.bind(jobordertypesController),
);
log.info('GET /jobordertypes/:joborder_type_id set');

jobordertypesRoute.patch(
  '/',
  [validateRequest({ body: CreateJobOrderTypes })],
  jobordertypesController.createJobOrderTypes.bind(jobordertypesController),
);
log.info('POST /jobordertypes/ set ');

jobordertypesRoute.put(
  '/:joborder_type_id',
  [validateRequest({ body: UpdateJobOrderTypes }), validateJobOrderTypesID],
  jobordertypesController.updateJobOrderTypes.bind(jobordertypesController),
);
log.info('PUT /jobordertypes/:joborder_types_id set ');

jobordertypesRoute.delete(
  '/:joborder_type_id',
  validateJobOrderTypesID,
  jobordertypesController.deleteJobOrderTypes.bind(jobordertypesController),
);
log.info('DELETE /jobordertypes/:joborder_types_id set');

export default jobordertypesRoute;
