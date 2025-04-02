import { Router } from 'express';
import log from '@/lib/logger';
import producttranslogRoute from './ProductTransLogs/PTL.route';
import ordertranslogRoute from './OrderTransLogs/OTL.route';

const logs = Router({ mergeParams: true });

// Business_logic
logs.use('/productlogs', producttranslogRoute);
log.info('ROUTE product logs set');

logs.use('/orderlogs', ordertranslogRoute);
log.info('ROUTE order logs set');

// Purpose: for table
export default logs;
