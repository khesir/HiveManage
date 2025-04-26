import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';
import { DamageItemController } from './damageItem.controller';
import { validateDamageItemID } from './damageItem.middleware';
import { CreateDamageItem, UpdateDamageItem } from './damageItem.model';

const damageitemRoute = Router({ mergeParams: true });
const damageitemController = new DamageItemController(db);

damageitemRoute.get(
  '/',
  damageitemController.getAllDamageItem.bind(damageitemController),
);
damageitemRoute.get(
  '/:damage_item_id',
  validateDamageItemID,
  damageitemController.getDamageItemById.bind(damageitemController),
);
damageitemRoute.post(
  '/',
  [validateRequest({ body: CreateDamageItem })],
  damageitemController.createDamageItem.bind(damageitemController),
);
damageitemRoute.put(
  '/:damage_item_id',
  [validateRequest({ body: UpdateDamageItem })],
  damageitemController.updateDamageItem.bind(damageitemController),
);
damageitemRoute.delete(
  '/:damage_item_id',
  validateDamageItemID,
  damageitemController.deleteDamageItem.bind(damageitemController),
);

export default damageitemRoute;
