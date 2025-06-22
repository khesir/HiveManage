import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';
import { CreateSerialize } from './serialize.model';
import { validateSerializedProductID } from './serialize.middleware';
import { SerializeItemController } from './serialize.controller';

const serialproductRoute = Router({ mergeParams: true });
const serializedproductController = new SerializeItemController(db);

serialproductRoute.get(
  '/',
  serializedproductController.getAllSerializedProducts.bind(
    serializedproductController,
  ),
);
serialproductRoute.get(
  '/:serial_id',
  validateSerializedProductID,
  serializedproductController.getSerializedProductById.bind(
    serializedproductController,
  ),
);
serialproductRoute.post(
  '/',
  [validateRequest({ body: CreateSerialize })],
  serializedproductController.createSerializeItem.bind(
    serializedproductController,
  ),
);
serialproductRoute.put(
  '/:serial_id',
  [validateRequest({ body: CreateSerialize })],
  serializedproductController.updateSerializeItem.bind(
    serializedproductController,
  ),
);
serialproductRoute.delete(
  '/:serial_id',
  validateSerializedProductID,
  serializedproductController.deleteSerializeItem.bind(
    serializedproductController,
  ),
);

export default serialproductRoute;
