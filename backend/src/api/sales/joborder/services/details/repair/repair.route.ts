import { Router } from 'express';
import { RepairController } from './repair.controller';
import { db } from '@/drizzle/pool';
import { validateRepairID } from './repair.middleware';
import { validateRequest } from '@/src/middlewares';
import { CreateRepair, UpdateRepair } from './repair.model';

const repairRoute = Router({ mergeParams: true });
const repairController = new RepairController(db);

repairRoute.get('/', repairController.getAllRepair.bind(repairController));

repairRoute.get(
  '/:repair_id',
  validateRepairID,
  repairController.getRepairById.bind(repairController),
);

repairRoute.post(
  '/',
  [validateRequest({ body: CreateRepair })],
  repairController.createRepair.bind(repairController),
);

repairRoute.put(
  '/:repair_id',
  [validateRequest({ body: UpdateRepair }), validateRepairID],
  repairController.UpdateRepair.bind(repairController),
);

repairRoute.delete(
  '/:repair_id',
  validateRepairID,
  repairController.deleteRepair.bind(repairController),
);

export default repairRoute;
