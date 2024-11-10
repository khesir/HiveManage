import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { PaymentController } from './payment.controller';
import { validatePaymentID } from './payment.middleware';
import { CreatePayment, UpdatePayment } from './payment.model';

const paymentRoute = Router({ mergeParams: true });
const paymentController = new PaymentController(db);

paymentRoute.get('/', paymentController.getAllPayment.bind(paymentController));

paymentRoute.get(
  '/:payment_id',
  validatePaymentID,
  paymentController.getPaymentById.bind(paymentController),
);

paymentRoute.post(
  '/',
  [validateRequest({ body: CreatePayment })],
  paymentController.createPayment.bind(paymentController),
);

paymentRoute.put(
  '/:payment_id',
  [validateRequest({ body: UpdatePayment }), validatePaymentID],
  paymentController.updatePayment.bind(paymentController),
);

paymentRoute.delete(
  '/:payment_id',
  validatePaymentID,
  paymentController.deletePayment.bind(paymentController),
);

export default paymentRoute;
