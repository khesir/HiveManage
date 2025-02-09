import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { ItemRecordController } from './itemrecord.controller';
import { validateItemRecordID } from './itemrecord.middleware';
import { CreateItemRecord, UpdateItemRecord } from './itemrecord.model';
import itemRoute from '../product_details/item.route';

const itemRecordRoute = Router({ mergeParams: true });
const itemRecordController = new ItemRecordController(db);

itemRecordRoute.get(
  '/',
  itemRecordController.getAllItemRecord.bind(itemRecordController),
);

itemRecordRoute.get(
  '/:item_record_id',
  validateItemRecordID,
  itemRecordController.getItemRecordById.bind(itemRecordController),
);

itemRecordRoute.post(
  '/',
  [validateRequest({ body: CreateItemRecord })],
  itemRecordController.createItemRecord.bind(itemRecordController),
);

itemRecordRoute.put(
  '/:item_record_id',
  [validateRequest({ body: UpdateItemRecord }), validateItemRecordID],
  itemRecordController.updateItemRecord.bind(itemRecordController),
);

itemRecordRoute.delete(
  '/:item_record_id',
  validateItemRecordID,
  itemRecordController.deleteItemRecord.bind(itemRecordController),
);

itemRecordRoute.use('/:item_record_id/item', validateItemRecordID, itemRoute);

export default itemRecordRoute;
