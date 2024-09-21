import { Router } from 'express';
import { validateRequest } from '../../../../src/middlewares';
import { db } from '../../../../mysql/mysql.pool';
import log from '../../../../lib/logger';
import { PaymentController } from './payment.controller';
import { validatePaymentID } from './payment.middleware';
import { CreatePayment, UpdatePayment } from './payment.model';

const paymentRoute = Router({ mergeParams: true });
const paymentController = new PaymentController(db);

paymentRoute.get('/', paymentController.getAllPayment.bind(paymentController));
log.info('GET /payment set');

paymentRoute.get(
  '/:payment_id',
  validatePaymentID,
  paymentController.getPaymentById.bind(paymentController),
);
log.info('GET /payment/:payment_id set');

paymentRoute.post(
  '/',
  [validateRequest({ body: CreatePayment })],
  paymentController.createPayment.bind(paymentController),
);
log.info('POST /payment/ set ');

paymentRoute.put(
  '/:payment_id',
  [validateRequest({ body: UpdatePayment }), validatePaymentID],
  paymentController.updatePayment.bind(paymentController),
);
log.info('PUT /payment/:payment_id set ');

paymentRoute.delete(
  '/:payment_id',
  validatePaymentID,
  paymentController.deletePayment.bind(paymentController),
);
log.info('DELETE /payment/:payment_id set');

export default paymentRoute;
