import { Router } from 'express';
import { CleaningController } from './cleaning.controller';
import { db } from '@/drizzle/pool';
import { validateCleaningID } from './cleaning.middleware';
import { validateRequest } from '@/src/middlewares';
import { CreateCleaning, UpdateCleaning } from './cleaning.model';

const cleaningRoute = Router({ mergeParams: true });
const cleaningController = new CleaningController(db);

cleaningRoute.get(
  '/',
  cleaningController.getAllCleaning.bind(cleaningController),
);

cleaningRoute.get(
  '/:cleaning_id',
  validateCleaningID,
  cleaningController.getCleaningById.bind(cleaningController),
);

cleaningRoute.post(
  '/',
  [validateRequest({ body: CreateCleaning })],
  cleaningController.createCleaning.bind(cleaningController),
);

cleaningRoute.put(
  '/:cleaning_id',
  [validateRequest({ body: UpdateCleaning }), validateCleaningID],
  cleaningController.UpdateCleaning.bind(cleaningController),
);

cleaningRoute.delete(
  '/:cleaning_id',
  validateCleaningID,
  cleaningController.deleteCleaning.bind(cleaningController),
);

export default cleaningRoute;
