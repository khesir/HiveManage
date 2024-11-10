import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { PositionController } from './position.controller';
import { validatePositionID } from './position.middleware';
import { CreatePosition, UpdatePosition } from './position.model';

const positionRoute = Router({ mergeParams: true });
const positionController = new PositionController(db);

positionRoute.get(
  '/',
  positionController.getAllPosition.bind(positionController),
);
log.info('GET /Position set');

positionRoute.get(
  '/:position_id',
  validatePositionID,
  positionController.getPositionById.bind(positionController),
);
log.info('GET /Position/:position_id set');

positionRoute.patch(
  '/:position_id',
  [validateRequest({ body: CreatePosition })],
  positionController.createPosition.bind(positionController),
);
log.info('POST /Position/ set ');

positionRoute.put(
  '/:position_id',
  [validateRequest({ body: UpdatePosition }), validatePositionID],
  positionController.updatePosition.bind(positionController),
);
log.info('PUT /Position/:position_id set ');

positionRoute.delete(
  '/:position_id',
  validatePositionID,
  positionController.deletePosition.bind(PositionController),
);
log.info('DELETE /Position/:position_id set');

export default positionRoute;
