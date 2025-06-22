import { Router } from 'express';
import log from '@/lib/logger';
import salesRoute from './sales/sales.route';
import assignedEmployeeRoute from './joborder/services/assignedemployees/assignedemployees.route';
import ticketsRoute from './joborder/services/tickets/ticket.route';
import tickettypesRoute from './joborder/services/ticketType/tickettype.route';
import servicetypesRoute from './joborder/services/servicetype/servicetype.route';
import jobrderRoute from './joborder/joborder.route';

const smsRoute = Router({ mergeParams: true });

// Business_logic
smsRoute.use('/tickets', ticketsRoute);

smsRoute.use('/assigned-employee', assignedEmployeeRoute);
log.info('ROUTE assigned-employee set');

smsRoute.use('/sales', salesRoute);
log.info('ROUTE sales set');

smsRoute.use('/joborder', jobrderRoute);
log.info('ROUTE joborder set');

smsRoute.use('/service-type', servicetypesRoute);
log.info('ROUTE service-type set');

smsRoute.use('/ticket-type', tickettypesRoute);
log.info('ROUTE ticket-type set');

// Purpose: for table
export default smsRoute;
