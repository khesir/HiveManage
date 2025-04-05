import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';
import { ServiceItemsController } from './serviceitem.controller';
import { validateServiceItemsID } from './serviceitem.middleware';
import { CreateServiceItem, UpdateServiceItem } from './serviceitem.model';

const serviceitemsRoute = Router({ mergeParams: true });
const serviceitemsController = new ServiceItemsController(db);

serviceitemsRoute.get(
  '/',
  serviceitemsController.getAllServiceItems.bind(serviceitemsController),
);

serviceitemsRoute.get(
  '/:service_items_id',
  validateServiceItemsID,
  serviceitemsController.getServiceItemsById.bind(serviceitemsController),
);

serviceitemsRoute.post(
  '/',
  [validateRequest({ body: CreateServiceItem })],
  serviceitemsController.createServiceItems.bind(serviceitemsController),
);

serviceitemsRoute.put(
  '/:service_items_id',
  [validateRequest({ body: UpdateServiceItem }), validateServiceItemsID],
  serviceitemsController.updateServiceItems.bind(serviceitemsController),
);

serviceitemsRoute.delete(
  '/:service_items_id',
  validateServiceItemsID,
  serviceitemsController.deleteServiceItems.bind(serviceitemsController),
);

export default serviceitemsRoute;
