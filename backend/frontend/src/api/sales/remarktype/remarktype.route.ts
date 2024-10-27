import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { RemarkTypesController } from './remarktype.controller';
import { validateRemarkTypeID } from './remarktype.middleware';
import { CreateRemarkType, UpdateRemarkType } from './remarktype.model';

const remarktypesRoute = Router({ mergeParams: true });
const remarktypesController = new RemarkTypesController(db);

remarktypesRoute.get(
  '/',
  remarktypesController.getAllRemarkTypes.bind(remarktypesController),
);
log.info('GET /remarktypes set');

remarktypesRoute.get(
  '/:remark_type_id',
  validateRemarkTypeID,
  remarktypesController.getRemarkTypesById.bind(remarktypesController),
);
log.info('GET /remarktypes/:remark_type_id set');

remarktypesRoute.patch(
  '/:remark_type_id',
  [validateRequest({ body: CreateRemarkType })],
  remarktypesController.createRemarkTypes.bind(remarktypesController),
);
log.info('POST /remarktypes/ set ');

remarktypesRoute.put(
  '/:remark_type_id',
  [validateRequest({ body: UpdateRemarkType }), validateRemarkTypeID],
  remarktypesController.updateRemarkTypes.bind(remarktypesController),
);
log.info('PUT /remarktypes/:remark_type_id set ');

remarktypesRoute.delete(
  '/:remark_type_id',
  validateRemarkTypeID,
  remarktypesController.deleteRemarkTypes.bind(remarktypesController),
);
log.info('DELETE /remarktypes/:remark_type_id set');

export default remarktypesRoute;
