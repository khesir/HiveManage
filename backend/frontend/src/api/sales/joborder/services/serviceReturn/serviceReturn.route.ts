import { Router } from 'express';
import { ServiceReturnController } from './serviceReturn.controller';
import { db } from '@/drizzle/pool';
import { validateServiceReturnID } from './serviceReturn.middleware';
import { validateRequest } from '@/src/middlewares';
import {
  CreateServiceReturn,
  UpdateServiceReturn,
} from './serviceReturn.model';

const serviceReturnRoute = Router({ mergeParams: true });
const buildController = new ServiceReturnController(db);

serviceReturnRoute.get(
  '/',
  buildController.getAllServiceReturn.bind(buildController),
);

serviceReturnRoute.get(
  '/:service_return_id',
  validateServiceReturnID,
  buildController.getServiceReturnById.bind(buildController),
);

serviceReturnRoute.post(
  '/',
  [validateRequest({ body: CreateServiceReturn })],
  buildController.createServiceReturn.bind(buildController),
);

serviceReturnRoute.put(
  '/:service_return_id',
  [validateRequest({ body: UpdateServiceReturn }), validateServiceReturnID],
  buildController.updateServiceReturn.bind(buildController),
);

serviceReturnRoute.delete(
  '/:service_return_id',
  validateServiceReturnID,
  buildController.deleteServiceReturn.bind(buildController),
);

export default serviceReturnRoute;
