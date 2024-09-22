import { Router } from 'express';
import { db } from '@/mysql/mysql.pool';
import log from '@/lib/logger';
import { validateRequest } from '@/src/middlewares';
import { ReportsController } from './reports.controller';
import { validateReportsID } from './reports.middleware';
import { CreateReports, UpdateReports } from './reports.model';

const reportsRoute = Router({ mergeParams: true });
const reportsController = new ReportsController(db);

reportsRoute.get('/', reportsController.getAllReports.bind(reportsController));
log.info('GET /report set');

reportsRoute.get(
  '/:reports_id',
  validateReportsID,
  reportsController.getReportsById.bind(reportsController),
);
log.info('GET /report/:reports_id set');

reportsRoute.post(
  '/',
  [validateRequest({ body: CreateReports })],
  reportsController.createReports.bind(reportsController),
);
log.info('POST /report/ set ');

reportsRoute.put(
  '/:reports_id',
  [validateRequest({ body: UpdateReports }), validateReportsID],
  reportsController.updateReports.bind(reportsController),
);
log.info('PUT /report/:reports_id set ');

reportsRoute.delete(
  '/:reports_id',
  validateReportsID,
  reportsController.deleteReports.bind(reportsController),
);
log.info('DELETE /report/:reports_id set');

export default reportsRoute;
