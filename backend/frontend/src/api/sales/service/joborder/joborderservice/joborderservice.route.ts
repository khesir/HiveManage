import { Router } from 'express';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { validateRequest } from '@/src/middlewares';
import { JobOrderServiceController } from './joborderservice.controller';
import { validateJobOrderServiceID } from './joborderservice.middleware';
import {
  CreateJobOrderServicesService,
  UpdateJobOrderServicesService,
} from './joborderservice.model';

const joborderServiceRoute = Router({ mergeParams: true });
const joborderServiceController = new JobOrderServiceController(db);

joborderServiceRoute.get(
  '/',
  joborderServiceController.getAllJobOrderService.bind(
    joborderServiceController,
  ),
);
log.info('GET /joborderservices set');

joborderServiceRoute.get(
  '/:joborder_services_id',
  validateJobOrderServiceID,
  joborderServiceController.getJobOrderServiceById.bind(
    joborderServiceController,
  ),
);
log.info('GET /joborderservices/:joborder_services_id set');

joborderServiceRoute.post(
  '/',
  [validateRequest({ body: CreateJobOrderServicesService })],
  joborderServiceController.createJobOrderService.bind(
    joborderServiceController,
  ),
);
log.info('POST /joborderservices/ set ');

joborderServiceRoute.put(
  '/:joborder_services_id',
  [
    validateRequest({ body: UpdateJobOrderServicesService }),
    validateJobOrderServiceID,
  ],
  joborderServiceController.updateJobOrderService.bind(
    joborderServiceController,
  ),
);
log.info('PUT /joborderservices/:joborder_services_id set ');

joborderServiceRoute.delete(
  '/:joborder_services_id',
  validateJobOrderServiceID,
  joborderServiceController.deleteJobOrderService.bind(
    joborderServiceController,
  ),
);
log.info('DELETE /joborderservices/:joborder_services_id set');

export default joborderServiceRoute;
