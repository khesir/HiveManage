import { Router } from 'express';
import log from '@/lib/logger';
import salesRoute from './sales/sales.route';
import discountRoute from './discounts/discount.route';
import assignedEmployeeRoute from './services/service/assignedemployees/assignedemployees.route';
import ticketsRoute from './services/service/tickets/ticket.route';
import tickettypesRoute from './services/service/ticketType/tickettype.route';
import serviceRoute from './services/service/service.route';

const smsRoute = Router({ mergeParams: true });

// Business_logic
smsRoute.use('/tickettype', tickettypesRoute);
log.info('ROUTE remarktype set');

smsRoute.use('/tickets', ticketsRoute);

smsRoute.use('/assigned-employee', assignedEmployeeRoute);
log.info('ROUTE assigned-employee set');

smsRoute.use('/sales', salesRoute);
log.info('ROUTE sales set');

smsRoute.use('/discount', discountRoute);
log.info('ROUTE discount set');

smsRoute.use('/service', serviceRoute);
log.info('ROUTE services set');
// Purpose: for table
export default smsRoute;
