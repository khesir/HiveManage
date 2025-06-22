import { Router } from 'express';
import { BuildController } from './build.controller';
import { db } from '@/drizzle/pool';
import { validateBuildID } from './build.middleware';
import { validateRequest } from '@/src/middlewares';
import { CreateBuild, UpdateBuild } from './build.model';

const buildRoute = Router({ mergeParams: true });
const buildController = new BuildController(db);

buildRoute.get('/', buildController.getAllBuild.bind(buildController));

buildRoute.get(
  '/:build_id',
  validateBuildID,
  buildController.getBuildById.bind(buildController),
);

buildRoute.post(
  '/',
  [validateRequest({ body: CreateBuild })],
  buildController.createBuild.bind(buildController),
);

buildRoute.put(
  '/:build_id',
  [validateRequest({ body: UpdateBuild }), validateBuildID],
  buildController.updateBuild.bind(buildController),
);

buildRoute.delete(
  '/:build_id',
  validateBuildID,
  buildController.deleteBuild.bind(buildController),
);

export default buildRoute;
