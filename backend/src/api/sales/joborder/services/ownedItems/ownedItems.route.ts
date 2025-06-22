import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';
import { OwnedServiceItemsController } from './ownedItems.controller';
import { validateOwnedServiceItemsID } from './ownedItems.middleware';
import {
  CreateOwnedServiceItems,
  UpdateOwnedServiceItems,
} from './ownedItems.model';

const ownedServiceItemsRoute = Router({ mergeParams: true });
const ownedServiceItemssController = new OwnedServiceItemsController(db);

ownedServiceItemsRoute.get(
  '/',
  ownedServiceItemssController.getAllOwnedServiceItems.bind(
    ownedServiceItemssController,
  ),
);

ownedServiceItemsRoute.get(
  '/:service_owned_id',
  validateOwnedServiceItemsID,
  ownedServiceItemssController.getOwnedServiceItemsById.bind(
    ownedServiceItemssController,
  ),
);

ownedServiceItemsRoute.post(
  '/',
  [validateRequest({ body: CreateOwnedServiceItems })],
  ownedServiceItemssController.createOwnedServiceItems.bind(
    ownedServiceItemssController,
  ),
);

ownedServiceItemsRoute.put(
  '/:service_owned_id',
  [
    validateRequest({ body: UpdateOwnedServiceItems }),
    validateOwnedServiceItemsID,
  ],
  ownedServiceItemssController.updateOwnedServiceItems.bind(
    ownedServiceItemssController,
  ),
);

ownedServiceItemsRoute.delete(
  '/:service_owned_id',
  validateOwnedServiceItemsID,
  ownedServiceItemssController.deleteOwnedServiceItems.bind(
    ownedServiceItemssController,
  ),
);

export default ownedServiceItemsRoute;
