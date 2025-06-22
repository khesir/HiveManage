import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { PositionController } from './position.controller';
import { validatePositionID } from './position.middleware';
import { CreatePosition, UpdatePosition } from './position.model';

const positionRoute = Router({ mergeParams: true });
const positionController = new PositionController(db);

positionRoute.get(
  '/',
  positionController.getAllPosition.bind(positionController),
);

positionRoute.get(
  '/:position_id',
  validatePositionID,
  positionController.getPositionById.bind(positionController),
);

positionRoute.patch(
  '/:position_id',
  [validateRequest({ body: CreatePosition })],
  positionController.createPosition.bind(positionController),
);

positionRoute.put(
  '/:position_id',
  [validateRequest({ body: UpdatePosition }), validatePositionID],
  positionController.updatePosition.bind(positionController),
);

positionRoute.delete(
  '/:position_id',
  validatePositionID,
  positionController.deletePosition.bind(PositionController),
);

export default positionRoute;
