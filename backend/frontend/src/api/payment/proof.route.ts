import { Router } from 'express';
import log from '@/lib/logger';
import paymentRoute from './payment/payment.route';
import receiptRoute from './receipt/receipt.route';

const pmsRoute = Router({ mergeParams: true });

// Business_logic
pmsRoute.use('/payment', paymentRoute);
log.info('ROUTE receipt types set');

pmsRoute.use('/receipt', receiptRoute);
log.info('ROUTE receipt set');

// Purpose: for table
export default pmsRoute;
