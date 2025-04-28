import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';
import { DamageItemController } from '../damageItem/damageItem.controller';
import { validateDamageRecordID } from './damageRecord.middleware';
import { CreateDamageRecord, UpdateDamageRecord } from './damageRecord.model';
import damageitemRoute from '../damageItem/damageItem.route';

const damageRecordRoute = Router({ mergeParams: true });
const damageRecordController = new DamageItemController(db);

damageRecordRoute.get(
  '/',
  damageRecordController.getAllDamageItem.bind(damageRecordController),
);
damageRecordRoute.get(
  '/:damage_record_id',
  validateDamageRecordID,
  damageRecordController.getDamageItemById.bind(damageRecordController),
);
damageRecordRoute.post(
  '/',
  [validateRequest({ body: CreateDamageRecord })],
  damageRecordController.createDamageItem.bind(damageRecordController),
);
damageRecordRoute.put(
  '/:damage_record_id',
  [validateRequest({ body: UpdateDamageRecord })],
  damageRecordController.updateDamageItem.bind(damageRecordController),
);
damageRecordRoute.delete(
  '/:damage_record_id',
  validateDamageRecordID,
  damageRecordController.deleteDamageItem.bind(damageRecordController),
);

damageRecordRoute.get(
  '/:damage_record_id/damage_items',
  validateDamageRecordID,
  damageitemRoute,
);

export default damageRecordRoute;
