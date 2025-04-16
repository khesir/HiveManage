import { Router } from 'express';
import log from '@/lib/logger';
import salesRoute from './sales/sales.route';
import assignedEmployeeRoute from './services/assignedemployees/assignedemployees.route';
import ticketsRoute from './services/tickets/ticket.route';
import tickettypesRoute from './services/ticketType/tickettype.route';
import serviceRoute from './services/service.route';
import servicetypesRoute from './services/servicetype/servicetype.route';

const smsRoute = Router({ mergeParams: true });

// Business_logic
smsRoute.use('/tickets', ticketsRoute);

smsRoute.use('/assigned-employee', assignedEmployeeRoute);
log.info('ROUTE assigned-employee set');

smsRoute.use('/sales', salesRoute);
log.info('ROUTE sales set');

smsRoute.use('/service', serviceRoute);
log.info('ROUTE services set');

smsRoute.use('/service-type', servicetypesRoute);
log.info('ROUTE service-type set');

smsRoute.use('/ticket-type', tickettypesRoute);
log.info('ROUTE ticket-type set');

// Purpose: for table
export default smsRoute;
