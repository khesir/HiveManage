import { Router } from 'express';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { validateRequest } from '@/src/middlewares';
import { RemarkContentController } from './remarkcontent.controller';
import { validateRemarkContentID } from './remarkcontent.middleware';
import {
  CreateRemarkContent,
  UpdateRemarkContent,
} from './remarkcontent.model';

const remarkContentRoute = Router({ mergeParams: true });
const remarkContentController = new RemarkContentController(db);

remarkContentRoute.get(
  '/',
  remarkContentController.getAllRemarkContent.bind(remarkContentController),
);
log.info('GET /remarkcontent set');

remarkContentRoute.get(
  '/:remarkcontent_id',
  validateRemarkContentID,
  remarkContentController.getRemarkContentById.bind(remarkContentController),
);
log.info('GET /remarkcontent/:remarkcontent_id set');

remarkContentRoute.post(
  '/',
  [validateRequest({ body: CreateRemarkContent })],
  remarkContentController.createRemarkContent.bind(remarkContentController),
);
log.info('POST /remarkcontent/ set ');

remarkContentRoute.put(
  '/:remarkcontent_id',
  [validateRequest({ body: UpdateRemarkContent }), validateRemarkContentID],
  remarkContentController.updateRemarkContent.bind(remarkContentController),
);
log.info('PUT /remarkcontent/:remarkcontent_id set ');

remarkContentRoute.delete(
  '/:remarkcontent_id',
  validateRemarkContentID,
  remarkContentController.deleteRemarkContent.bind(remarkContentController),
);
log.info('DELETE /remarkcontent/:remarkcontent_id set');

export default remarkContentRoute;
