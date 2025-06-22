import { Router } from 'express';
import { ReplacementController } from './replacement.controller';
import { db } from '@/drizzle/pool';
import { validateReplacementID } from './replacement.middleware';
import { validateRequest } from '@/src/middlewares';
import { CreateReplacement, UpdateReplacement } from './replacement.model';

const replacementRoute = Router({ mergeParams: true });
const replacementController = new ReplacementController(db);

replacementRoute.get(
  '/',
  replacementController.getAllReplacement.bind(replacementController),
);

replacementRoute.get(
  '/:replacement_id',
  validateReplacementID,
  replacementController.getReplacementById.bind(replacementController),
);

replacementRoute.post(
  '/',
  [validateRequest({ body: CreateReplacement })],
  replacementController.createReplacement.bind(replacementController),
);

replacementRoute.put(
  '/:replacement_id',
  [validateRequest({ body: UpdateReplacement }), validateReplacementID],
  replacementController.updateReplacement.bind(replacementController),
);

replacementRoute.delete(
  '/:replacement_id',
  validateReplacementID,
  replacementController.deleteReplacement.bind(replacementController),
);

export default replacementRoute;
