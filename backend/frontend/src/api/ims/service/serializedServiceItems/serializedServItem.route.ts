import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';
import { SerializeServItemController } from './serializedServItem.controller';
import { validateSerializedServiceItemID } from './serializedServItem.middleware';
import {
  CreateSerializeServiceItem,
  UpdateSerializeServiceItem,
} from './serializedServItem.model';

const serialserviceitemRoute = Router({ mergeParams: true });
const serialserviceitemController = new SerializeServItemController(db);

serialserviceitemRoute.get(
  '/',
  serialserviceitemController.getAllSerializeServItem.bind(
    serialserviceitemController,
  ),
);
serialserviceitemRoute.get(
  '/:serial_id',
  validateSerializedServiceItemID,
  serialserviceitemController.getSerializeServItemById.bind(
    serialserviceitemController,
  ),
);
serialserviceitemRoute.post(
  '/',
  [validateRequest({ body: CreateSerializeServiceItem })],
  serialserviceitemController.createSerializeServItem.bind(
    serialserviceitemController,
  ),
);
serialserviceitemRoute.put(
  '/:serial_id',
  [validateRequest({ body: UpdateSerializeServiceItem })],
  serialserviceitemController.updateSerializeServItem.bind(
    serialserviceitemController,
  ),
);
serialserviceitemRoute.delete(
  '/:serial_id',
  validateSerializedServiceItemID,
  serialserviceitemController.deleteSerializeServItem.bind(
    serialserviceitemController,
  ),
);

export default serialserviceitemRoute;
