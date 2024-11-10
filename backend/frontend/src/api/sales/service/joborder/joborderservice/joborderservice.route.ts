import { Router } from 'express';
import { db } from '@/drizzle/pool';
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

joborderServiceRoute.get(
  '/:joborder_services_id',
  validateJobOrderServiceID,
  joborderServiceController.getJobOrderServiceById.bind(
    joborderServiceController,
  ),
);

joborderServiceRoute.post(
  '/',
  [validateRequest({ body: CreateJobOrderServicesService })],
  joborderServiceController.createJobOrderService.bind(
    joborderServiceController,
  ),
);

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

joborderServiceRoute.delete(
  '/:joborder_services_id',
  validateJobOrderServiceID,
  joborderServiceController.deleteJobOrderService.bind(
    joborderServiceController,
  ),
);

export default joborderServiceRoute;
