import { Router } from 'express';
import log from '@/lib/logger';
import serviceRoute from './service/serviceses.route';
import jobordertypesRoute from './jobordertypes/jobordertypes.route';
import joborderRoute from './service/joborder/joborder.route';
import assignedEmployeeRoute from './service/joborder/assignedemployees/assignedemployees.route';

const smsRoute = Router({ mergeParams: true });

// Business_logic
smsRoute.use('/joborder-types', jobordertypesRoute);
log.info('ROUTE joborder types set');

smsRoute.use('/joborder', joborderRoute);
log.info('ROUTE job order set');

smsRoute.use('/service', serviceRoute);
log.info('ROUTE service set');

// Soon Change to JoborderAssign
smsRoute.use('/assigned-employee', assignedEmployeeRoute);
// put 3 services here for get all endpoint
// Reserve
// Borrow
// Job order

// Purpose: for table
export default smsRoute;
