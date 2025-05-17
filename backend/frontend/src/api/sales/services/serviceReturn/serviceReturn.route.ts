import { Router } from 'express';
import { ServiceReturnController } from './serviceReturn.controller';
import { db } from '@/drizzle/pool';
import { validateServiceReturnID } from './serviceReturn.middleware';
import { validateRequest } from '@/src/middlewares';
import {
  CreateServiceReturn,
  UpdateServiceReturn,
} from './serviceReturn.model';

const serviceReturnRote = Router({ mergeParams: true });
const buildController = new ServiceReturnController(db);

serviceReturnRote.get(
  '/',
  buildController.getAllServiceReturn.bind(buildController),
);

serviceReturnRote.get(
  '/:service_return_id',
  validateServiceReturnID,
  buildController.getServiceReturnById.bind(buildController),
);

serviceReturnRote.post(
  '/',
  [validateRequest({ body: CreateServiceReturn })],
  buildController.createServiceReturn.bind(buildController),
);

serviceReturnRote.put(
  '/:service_return_id',
  [validateRequest({ body: UpdateServiceReturn }), validateServiceReturnID],
  buildController.updateServiceReturn.bind(buildController),
);

serviceReturnRote.delete(
  '/:service_return_id',
  validateServiceReturnID,
  buildController.deleteServiceReturn.bind(buildController),
);

export default serviceReturnRote;
