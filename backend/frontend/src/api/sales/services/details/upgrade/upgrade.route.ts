import { Router } from 'express';
import { UpgradeController } from './upgrade.controller';
import { db } from '@/drizzle/pool';
import { validateUpgradeID } from './upgrade.middleware';
import { validateRequest } from '@/src/middlewares';
import { CreateUpgrade, UpdateUpgrade } from './upgrade.model';

const upgradeRoute = Router({ mergeParams: true });
const upgradeController = new UpgradeController(db);

upgradeRoute.get('/', upgradeController.getAllUpgrade.bind(upgradeController));

upgradeRoute.get(
  '/:Upgrade_id',
  validateUpgradeID,
  upgradeController.getUpgradeById.bind(upgradeController),
);

upgradeRoute.post(
  '/',
  [validateRequest({ body: CreateUpgrade })],
  upgradeController.createUpgrade.bind(upgradeController),
);

upgradeRoute.put(
  '/:Upgrade_id',
  [validateRequest({ body: UpdateUpgrade }), validateUpgradeID],
  upgradeController.UpdateUpgrade.bind(upgradeController),
);

upgradeRoute.delete(
  '/:Upgrade_id',
  validateUpgradeID,
  upgradeController.deleteUpgrade.bind(upgradeController),
);

export default upgradeRoute;
