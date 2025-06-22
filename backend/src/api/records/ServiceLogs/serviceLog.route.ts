import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { ServiceLogController } from './serviceLog.controller';
import { CreateServiceLog } from './serviceLog.model';

const servicelogRoute = Router({ mergeParams: true });
const servicelogController = new ServiceLogController(db);

servicelogRoute.get(
  '/',
  servicelogController.getSalesLog.bind(servicelogController),
);

servicelogRoute.post(
  '/',
  [validateRequest({ body: CreateServiceLog })],
  servicelogController.createSalesLog.bind(servicelogController),
);

export default servicelogRoute;
