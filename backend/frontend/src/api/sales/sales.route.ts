import { Router } from 'express';
import log from '@/lib/logger';
import jobordertypesRoute from './service/joborder/jobordertypes/jobordertypes.route';
import joborderRoute from './service/joborder/joborder.route';
import assignedEmployeeRoute from './service/joborder/assignedemployees/assignedemployees.route';
import remarktypesRoute from './service/joborder/remarktype/remarktype.route';
import remarkTicketsRoute from './service/joborder/remarktickets/remarkticket.route';
import reserveRoute from './service/reserve/reserve.route';
import borrowRoute from './service/borrow/borrow.route';
import salesRoute from './sales/sales.route';
import discountRoute from './discounts/discount.route';

const smsRoute = Router({ mergeParams: true });

// Business_logic
smsRoute.use('/joborder-types', jobordertypesRoute);
log.info('ROUTE joborder types set');

smsRoute.use('/remark-type', remarktypesRoute);
log.info('ROUTE remarktype set');

smsRoute.use('/joborder', joborderRoute);
log.info('ROUTE job order set');

smsRoute.use('/remark-tickets', remarkTicketsRoute);

smsRoute.use('/assigned-employee', assignedEmployeeRoute);
log.info('ROUTE assigned-employee set');

smsRoute.use('/reserve', reserveRoute);
log.info('ROUTE reserve set');

smsRoute.use('/borrow', borrowRoute);
log.info('ROUTE borrow set');

smsRoute.use('/sales', salesRoute);
log.info('ROUTE sales set');

smsRoute.use('/discount', discountRoute);
log.info('ROUTE discount set');

// Purpose: for table
export default smsRoute;
