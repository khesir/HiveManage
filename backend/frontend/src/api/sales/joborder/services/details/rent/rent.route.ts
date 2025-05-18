import { Router } from 'express';
import { RentController } from './rent.controller';
import { db } from '@/drizzle/pool';
import { validateRentID } from './rent.middleware';
import { validateRequest } from '@/src/middlewares';
import { CreateRent, UpdateRent } from './rent.model';

const rentRoute = Router({ mergeParams: true });
const rentController = new RentController(db);

rentRoute.get('/', rentController.getAllRent.bind(rentController));

rentRoute.get(
  '/:rent_id',
  validateRentID,
  rentController.getRentById.bind(rentController),
);

rentRoute.post(
  '/',
  [validateRequest({ body: CreateRent })],
  rentController.createRent.bind(rentController),
);

rentRoute.put(
  '/:rent_id',
  [validateRequest({ body: UpdateRent }), validateRentID],
  rentController.updateRent.bind(rentController),
);

rentRoute.delete(
  '/:rent_id',
  validateRentID,
  rentController.deleterent.bind(rentController),
);

export default rentRoute;
