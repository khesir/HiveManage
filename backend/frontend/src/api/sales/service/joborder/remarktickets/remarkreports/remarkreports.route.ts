import { Router } from 'express';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { validateRequest } from '@/src/middlewares';
import { RemarkReportsController } from './remarkreports.controller';
import { validateRemarkReportsID } from './remarkreports.middleware';
import {
  CreateRemarkReports,
  UpdateRemarkReports,
} from './remarkreports.model';

const remarkReportsRoute = Router({ mergeParams: true });
const remarkReportsController = new RemarkReportsController(db);

remarkReportsRoute.get(
  '/',
  remarkReportsController.getAllRemarkReports.bind(remarkReportsController),
);
log.info('GET /remarkreports set');

remarkReportsRoute.get(
  '/:remark_reports_id',
  validateRemarkReportsID,
  remarkReportsController.getRemarkReportsById.bind(remarkReportsController),
);
log.info('GET /remarkreports/:remark_reports_id set');

remarkReportsRoute.post(
  '/',
  [validateRequest({ body: CreateRemarkReports })],
  remarkReportsController.createRemarkReports.bind(remarkReportsController),
);
log.info('POST /remarkreports/ set ');

remarkReportsRoute.put(
  '/:remark_reports_id',
  [validateRequest({ body: UpdateRemarkReports }), validateRemarkReportsID],
  remarkReportsController.updateRemarkReports.bind(remarkReportsController),
);
log.info('PUT /remarkreports/:remark_reports_id set ');

remarkReportsRoute.delete(
  '/:remark_reports_id',
  validateRemarkReportsID,
  remarkReportsController.deleteRemarkReports.bind(remarkReportsController),
);
log.info('DELETE /remarkreports/:remark_reports_id set');

export default remarkReportsRoute;
