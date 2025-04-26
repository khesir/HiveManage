import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';
import { ServiceItemController } from './serviceItem.controller';
import { validateServiceItemID } from './serviceItem.middleware';
import { CreateServiceItem, UpdateServiceItem } from './serviceItem.model';

const serviceitemRoute = Router({ mergeParams: true });
const serviceitemController = new ServiceItemController(db);

serviceitemRoute.get(
  '/',
  serviceitemController.getAllServiceItem.bind(serviceitemController),
);
serviceitemRoute.get(
  '/:serial_id',
  validateServiceItemID,
  serviceitemController.getServiceItemById.bind(serviceitemController),
);
serviceitemRoute.post(
  '/',
  [validateRequest({ body: CreateServiceItem })],
  serviceitemController.createServiceItem.bind(serviceitemController),
);
serviceitemRoute.put(
  '/:serial_id',
  [validateRequest({ body: UpdateServiceItem })],
  serviceitemController.updateServiceItem.bind(serviceitemController),
);
serviceitemRoute.delete(
  '/:serial_id',
  validateServiceItemID,
  serviceitemController.deleteServiceItem.bind(serviceitemController),
);

export default serviceitemRoute;
