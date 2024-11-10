import { Router } from 'express';
import { db } from '@/drizzle/pool';
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

remarkContentRoute.get(
  '/:remarkcontent_id',
  validateRemarkContentID,
  remarkContentController.getRemarkContentById.bind(remarkContentController),
);

remarkContentRoute.post(
  '/',
  [validateRequest({ body: CreateRemarkContent })],
  remarkContentController.createRemarkContent.bind(remarkContentController),
);

remarkContentRoute.put(
  '/:remarkcontent_id',
  [validateRequest({ body: UpdateRemarkContent }), validateRemarkContentID],
  remarkContentController.updateRemarkContent.bind(remarkContentController),
);

remarkContentRoute.delete(
  '/:remarkcontent_id',
  validateRemarkContentID,
  remarkContentController.deleteRemarkContent.bind(remarkContentController),
);

export default remarkContentRoute;
