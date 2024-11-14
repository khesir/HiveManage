import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
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
log.info('GET /inventoryrecord set');

inventoryRecordRoute.get(
  '/:inventory_record_id',
  validateInventoryRecordID,
  inventoryRecordController.getInventoryRecordById.bind(
    inventoryRecordController,
  ),
);
log.info('GET /inventoryrecord/:inventory_record_id set');

inventoryRecordRoute.post(
  '/',
  [validateRequest({ body: CreateInventoryRecord })],
  inventoryRecordController.createInventoryRecord.bind(
    inventoryRecordController,
  ),
);
log.info('POST /inventoryrecord/ set ');

inventoryRecordRoute.put(
  '/:inventory_record_id',
  [validateRequest({ body: UpdateInventoryRecord }), validateInventoryRecordID],
  inventoryRecordController.updateInventoryRecord.bind(
    inventoryRecordController,
  ),
);
log.info('PUT /inventoryrecord/:inventory_record_id set ');

inventoryRecordRoute.delete(
  '/:inventory_record_id',
  validateInventoryRecordID,
  inventoryRecordController.deleteInventoryRecord.bind(
    inventoryRecordController,
  ),
);
log.info('DELETE /inventoryrecord/:inventory_record_id set');

export default inventoryRecordRoute;
