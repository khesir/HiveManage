import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';
import { InventoryMovementController } from './inventoryMovement.controller';
import { validateInventoryMovementID } from './inventoryMovement.middleware';
import {
  CreateInventoryMovement,
  UpdateInventoryMovement,
} from './inventoryMovement.model';

const inventorymovementRoute = Router({ mergeParams: true });
const inventorymovementController = new InventoryMovementController(db);

inventorymovementRoute.get(
  '/',
  inventorymovementController.getAllInventoryMovement.bind(
    inventorymovementController,
  ),
);
inventorymovementRoute.get(
  '/:damage_item_id',
  validateInventoryMovementID,
  inventorymovementController.getInventoryMovementById.bind(
    inventorymovementController,
  ),
);
inventorymovementRoute.post(
  '/',
  [validateRequest({ body: CreateInventoryMovement })],
  inventorymovementController.createInventoryMovement.bind(
    inventorymovementController,
  ),
);
inventorymovementRoute.put(
  '/:damage_item_id',
  [validateRequest({ body: UpdateInventoryMovement })],
  inventorymovementController.updateInventoryMovement.bind(
    inventorymovementController,
  ),
);
inventorymovementRoute.delete(
  '/:damage_item_id',
  validateInventoryMovementID,
  inventorymovementController.deleteInventoryMovement.bind(
    inventorymovementController,
  ),
);

export default inventorymovementRoute;
