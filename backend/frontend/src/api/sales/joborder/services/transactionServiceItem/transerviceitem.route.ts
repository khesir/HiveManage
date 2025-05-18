import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';
import { TranServiceItemsController } from './transerviceitem.controller';
import { validateTranServiceItemsID } from './transerviceitem.middleware';
import {
  CreateTranServiceItem,
  UpdateTranServiceItem,
} from './transerviceitem.model';

const transerviceitemsRoute = Router({ mergeParams: true });
const transerviceitemsController = new TranServiceItemsController(db);

transerviceitemsRoute.get(
  '/',
  transerviceitemsController.getAllTranServiceItems.bind(
    transerviceitemsController,
  ),
);

transerviceitemsRoute.get(
  '/:transaction_service_Record',
  validateTranServiceItemsID,
  transerviceitemsController.getTranServiceItemsById.bind(
    transerviceitemsController,
  ),
);

transerviceitemsRoute.post(
  '/',
  [validateRequest({ body: CreateTranServiceItem })],
  transerviceitemsController.createTranServiceItems.bind(
    transerviceitemsController,
  ),
);

transerviceitemsRoute.put(
  '/:transaction_service_Record',
  [
    validateRequest({ body: UpdateTranServiceItem }),
    validateTranServiceItemsID,
  ],
  transerviceitemsController.updateTranServiceItems.bind(
    transerviceitemsController,
  ),
);

transerviceitemsRoute.delete(
  '/:transaction_service_Record',
  validateTranServiceItemsID,
  transerviceitemsController.deleteTranServiceItems.bind(
    transerviceitemsController,
  ),
);

export default transerviceitemsRoute;
