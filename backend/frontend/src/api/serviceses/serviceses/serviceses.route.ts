import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { ServiceController } from './serviceses.controller';
import { validateServiceID } from './serviceses.middleware';
import { CreateService, UpdateService } from './serviceses.model';

const serviceRoute = Router({ mergeParams: true });
const serviceController = new ServiceController(db);

serviceRoute.get('/', serviceController.getAllService.bind(serviceController));
log.info('GET /service set');

serviceRoute.get(
  '/:service_id',
  validateServiceID,
  serviceController.getServiceById.bind(serviceController),
);
log.info('GET /service/:service_id set');

serviceRoute.post(
  '/',
  [validateRequest({ body: CreateService })],
  serviceController.createService.bind(serviceController),
);
log.info('POST /service/ set ');

serviceRoute.put(
  '/:service_id',
  [validateRequest({ body: UpdateService }), validateServiceID],
  serviceController.updateService.bind(serviceController),
);
log.info('PUT /service/:service_id set ');

serviceRoute.delete(
  '/:service_id',
  validateServiceID,
  serviceController.deleteService.bind(serviceController),
);
log.info('DELETE /service/:service_id set');

export default serviceRoute;
