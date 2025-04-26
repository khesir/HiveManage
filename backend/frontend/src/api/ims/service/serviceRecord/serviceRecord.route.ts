import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';
import { ServiceRecordController } from './serviceRecord.controller';
import {
  CreateServiceRecord,
  UpdateServiceRecord,
} from './serviceRecord.model';
import { validateServiceRecordID } from './serviceRecord.middleware';
import serialserviceitemRoute from '../serializedServiceItems/serializedServItem.route';
import transerviceitemsRoute from '@/src/api/sales/services/transactionServiceItem/transerviceitem.route';

const serviceRecordRoute = Router({ mergeParams: true });
const serviceRecordController = new ServiceRecordController(db);

serviceRecordRoute.get(
  '/',
  serviceRecordController.getAllServiceRecord.bind(serviceRecordController),
);
serviceRecordRoute.get(
  '/:service_record_id',
  validateServiceRecordID,
  serviceRecordController.getServiceRecordById.bind(serviceRecordController),
);
serviceRecordRoute.post(
  '/',
  [validateRequest({ body: CreateServiceRecord })],
  serviceRecordController.createServiceRecord.bind(serviceRecordController),
);
serviceRecordRoute.put(
  '/:service_record_id',
  [validateRequest({ body: UpdateServiceRecord })],
  serviceRecordController.updateServiceRecord.bind(serviceRecordController),
);
serviceRecordRoute.delete(
  '/:service_record_id',
  validateServiceRecordID,
  serviceRecordController.deleteServiceRecord.bind(serviceRecordController),
);

serviceRecordRoute.get(
  '/:service_record_id/service_serialize_record',
  validateServiceRecordID,
  serialserviceitemRoute,
);

serviceRecordRoute.get(
  '/:service_record_id/transaction_service_Item',
  validateServiceRecordID,
  transerviceitemsRoute,
);

export default serviceRecordRoute;
