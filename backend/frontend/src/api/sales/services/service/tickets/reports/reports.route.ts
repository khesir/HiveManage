import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';
import { ReportsController } from './reports.controller';
import { validateReportsID } from './reports.middleware';
import { CreateReports, UpdateReports } from './reports.model';

const reportsRoute = Router({ mergeParams: true });
const reportsController = new ReportsController(db);

reportsRoute.get('/', reportsController.getAllReports.bind(reportsController));

reportsRoute.get(
  '/:reports_id',
  validateReportsID,
  reportsController.getReportsById.bind(reportsController),
);

reportsRoute.post(
  '/',
  [validateRequest({ body: CreateReports })],
  reportsController.createReports.bind(reportsController),
);

reportsRoute.put(
  '/:reports_id',
  [validateRequest({ body: UpdateReports }), validateReportsID],
  reportsController.updateReports.bind(reportsController),
);

reportsRoute.delete(
  '/:reports_id',
  validateReportsID,
  reportsController.deleteReports.bind(reportsController),
);

export default reportsRoute;
