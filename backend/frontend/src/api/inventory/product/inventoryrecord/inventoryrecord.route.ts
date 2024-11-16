import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { InventoryRecordController } from './inventoryrecord.controller';
import { validateInventoryRecordID } from './inventoryrecord.middleware';
import {
  CreateInventoryRecord,
  UpdateInventoryRecord,
} from './inventoryrecord.model';

const inventoryRecordRoute = Router({ mergeParams: true });
const inventoryRecordController = new InventoryRecordController(db);

inventoryRecordRoute.get(
  '/',
  inventoryRecordController.getAllInventoryRecord.bind(
    inventoryRecordController,
  ),
);

inventoryRecordRoute.get(
  '/:inventory_record_id',
  validateInventoryRecordID,
  inventoryRecordController.getInventoryRecordById.bind(
    inventoryRecordController,
  ),
);

inventoryRecordRoute.post(
  '/',
  [validateRequest({ body: CreateInventoryRecord })],
  inventoryRecordController.createInventoryRecord.bind(
    inventoryRecordController,
  ),
);

inventoryRecordRoute.put(
  '/:inventory_record_id',
  [validateRequest({ body: UpdateInventoryRecord }), validateInventoryRecordID],
  inventoryRecordController.updateInventoryRecord.bind(
    inventoryRecordController,
  ),
);

inventoryRecordRoute.delete(
  '/:inventory_record_id',
  validateInventoryRecordID,
  inventoryRecordController.deleteInventoryRecord.bind(
    inventoryRecordController,
  ),
);

export default inventoryRecordRoute;
