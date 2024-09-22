import { Router } from 'express';
import salesRoute from './sales/sales.route';
import log from '../../../lib/logger';
import salesitemRoute from './salesItem/salesItem.route';
import paymentRoute from './payment/payment.route';
import receiptRoute from './receipt/receipt.route';

const smsRoute = Router({ mergeParams: true });

smsRoute.use('/sales', salesRoute);
log.info('ROUTE sales set ');

smsRoute.use('/salesitem', salesitemRoute);
log.info('ROUTE salesitem set');

smsRoute.use('/payment', paymentRoute);
log.info('ROUTE payment set');

smsRoute.use('/receipt', receiptRoute);
log.info('ROUTE receipt set');

export default smsRoute;
