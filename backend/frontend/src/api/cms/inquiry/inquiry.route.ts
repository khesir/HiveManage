import { Router } from 'express';
import { db } from '@/mysql/mysql.pool';
import log from '@/lib/logger';
import { validateRequest } from '@/src/middlewares';
import { InquiryController } from './inquiry.controller';
import { validateInquiryID } from './inquiry.middleware';
import { CreateInquiry, UpdateInquiry } from './inquiry.model';

const inquiryRoute = Router({ mergeParams: true });
const inquiryController = new InquiryController(db);

inquiryRoute.get('/', inquiryController.getAllInquiry.bind(inquiryController));
log.info('GET /inquiry set');

inquiryRoute.get(
  '/:inquiry_id',
  validateInquiryID,
  inquiryController.getInquiryById.bind(inquiryController),
);
log.info('GET /inquiry/:inquiry_id set');

inquiryRoute.post(
  '/',
  [validateRequest({ body: CreateInquiry })],
  inquiryController.createInquiry.bind(inquiryController),
);
log.info('POST /inquiry/ set ');

inquiryRoute.put(
  '/:inquiry_id',
  [validateRequest({ body: UpdateInquiry }), validateInquiryID],
  inquiryController.updateInquiry.bind(inquiryController),
);
log.info('PUT /inquiry/:inquiry_id set ');

inquiryRoute.delete(
  '/:inquiry_id',
  validateInquiryID,
  inquiryController.deleteInquiry.bind(inquiryController),
);
log.info('DELETE /inquiry/:inquiry_id set');

export default inquiryRoute;
