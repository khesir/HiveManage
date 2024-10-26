import { Router } from 'express';
import log from '@/lib/logger';
import serviceRoute from './service/serviceses.route';
import jobordertypesRoute from './jobordertypes/jobordertypes.route';

const smsRoute = Router({ mergeParams: true });

// Busness_logic
smsRoute.use('/joborder-types', jobordertypesRoute);
log.info('ROUTE joborder types set');

smsRoute.use('/service', serviceRoute);
log.info('ROUTE service set');
// put 3 services here for get all endpoint
// Reserve
// Borrow
// Job order
// Purpose: for table
export default smsRoute;
