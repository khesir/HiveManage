import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { ServiceTypesController } from './servicetype.controller';
import { validateServiceTypeID } from './servicetype.middleware';
import { CreateServiceType, UpdateServiceType } from './servicetype.model';

const servicetypesRoute = Router({ mergeParams: true });
const servicetypesController = new ServiceTypesController(db);

servicetypesRoute.get(
  '/',
  servicetypesController.getAllServiceTypes.bind(servicetypesController),
);
log.info('GET /servicetypes set');

servicetypesRoute.get(
  '/:service_type_id',
  validateServiceTypeID,
  servicetypesController.getServiceTypesById.bind(servicetypesController),
);
log.info('GET /servicetypes/:service_type_id set');

servicetypesRoute.patch(
  '/:service_type_id',
  [validateRequest({ body: CreateServiceType })],
  servicetypesController.createServiceTypes.bind(servicetypesController),
);
log.info('POST /servicetypes/ set ');

servicetypesRoute.put(
  '/:service_type_id',
  [validateRequest({ body: UpdateServiceType }), validateServiceTypeID],
  servicetypesController.updateServiceTypes.bind(servicetypesController),
);
log.info('PUT /servicetypes/:service_type_id set ');

servicetypesRoute.delete(
  '/:service_type_id',
  validateServiceTypeID,
  servicetypesController.deleteServiceTypes.bind(servicetypesController),
);
log.info('DELETE /servicetypes/:service_type_id set');

export default servicetypesRoute;
