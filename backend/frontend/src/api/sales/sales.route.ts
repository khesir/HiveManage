import { Router } from 'express';
import log from '@/lib/logger';
import serviceRoute from './service/serviceses.route';
import jobordertypesRoute from './service/joborder/jobordertypes/jobordertypes.route';
import joborderRoute from './service/joborder/joborder.route';
import assignedEmployeeRoute from './service/joborder/assignedemployees/assignedemployees.route';
import remarktypesRoute from './service/joborder/remarktype/remarktype.route';
import remarkTicketsRoute from './service/joborder/remarktickets/remarkticket.route';

const smsRoute = Router({ mergeParams: true });

// Business_logic
smsRoute.use('/joborder-types', jobordertypesRoute);
log.info('ROUTE joborder types set');

smsRoute.use('/remark-type', remarktypesRoute);
log.info('ROUTE remarktype set');

smsRoute.use('/joborder', joborderRoute);
log.info('ROUTE job order set');

smsRoute.use('/service', serviceRoute);
log.info('ROUTE service set');

smsRoute.use('/remark-tickets', remarkTicketsRoute);

// Join tables
smsRoute.use('/assigned-employee', assignedEmployeeRoute);
log.info('ROUTE assigned-employee set');

// Purpose: for table
export default smsRoute;
