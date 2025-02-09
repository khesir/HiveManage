import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';
import { CreateSerialize } from './serialize.model';
import { validateSerializedID } from './serialize.middleware';
import { SerializeItemController } from './serialize.controller';

const serialRoute = Router({ mergeParams: true });
const serializedController = new SerializeItemController(db);

serialRoute.get(
  '/',
  serializedController.getAllSerializeItem.bind(serializedController),
);
serialRoute.get(
  '/:serial_id',
  validateSerializedID,
  serializedController.getSerializeItemById.bind(serializedController),
);
serialRoute.post(
  '/',
  [validateRequest({ body: CreateSerialize })],
  serializedController.createSerializeItem.bind(serializedController),
);
serialRoute.put(
  '/:serial_id',
  [validateRequest({ body: CreateSerialize })],
  serializedController.updateSerializeItem.bind(serializedController),
);
serialRoute.delete(
  '/:serial_id',
  validateSerializedID,
  serializedController.deleteSerializeItem.bind(serializedController),
);

export default serialRoute;
