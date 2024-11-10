import { Router } from 'express';
import { db } from '@/drizzle/pool';
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

remarkReportsRoute.get(
  '/:remark_reports_id',
  validateRemarkReportsID,
  remarkReportsController.getRemarkReportsById.bind(remarkReportsController),
);

remarkReportsRoute.post(
  '/',
  [validateRequest({ body: CreateRemarkReports })],
  remarkReportsController.createRemarkReports.bind(remarkReportsController),
);

remarkReportsRoute.put(
  '/:remark_reports_id',
  [validateRequest({ body: UpdateRemarkReports }), validateRemarkReportsID],
  remarkReportsController.updateRemarkReports.bind(remarkReportsController),
);

remarkReportsRoute.delete(
  '/:remark_reports_id',
  validateRemarkReportsID,
  remarkReportsController.deleteRemarkReports.bind(remarkReportsController),
);

export default remarkReportsRoute;
