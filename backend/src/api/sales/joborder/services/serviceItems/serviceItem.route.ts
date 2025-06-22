import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';
import { ServiceItemController } from './serviceItem.controller';
import { validateServiceItemID } from './serviceItem.middleware';
import { CreateServiceItem, UpdateServiceItem } from './serviceItem.model';

const serviceItemRoute = Router({ mergeParams: true });
const serviceitemController = new ServiceItemController(db);

serviceItemRoute.get(
  '/',
  serviceitemController.getAllServiceItem.bind(serviceitemController),
);
serviceItemRoute.get(
  '/:service_item_id',
  validateServiceItemID,
  serviceitemController.getServiceItemById.bind(serviceitemController),
);
serviceItemRoute.post(
  '/',
  [validateRequest({ body: CreateServiceItem })],
  serviceitemController.createServiceItem.bind(serviceitemController),
);
serviceItemRoute.put(
  '/:service_item_id',
  [validateRequest({ body: UpdateServiceItem })],
  serviceitemController.updateServiceItem.bind(serviceitemController),
);
serviceItemRoute.delete(
  '/:service_item_id',
  validateServiceItemID,
  serviceitemController.deleteServiceItem.bind(serviceitemController),
);

export default serviceItemRoute;
