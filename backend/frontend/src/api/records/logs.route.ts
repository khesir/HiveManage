import { Router } from 'express';
import log from '@/lib/logger';
import servicelogRoute from './ServiceLogs/serviceLog.route';
import employeelogRoute from './EmployeeLogs/employeeLog.route';
import productlogRoute from './ProductTransLogs/PTL.route';

const logs = Router({ mergeParams: true });

// Business_logic
logs.use('/productlogs', productlogRoute);
log.info('ROUTE product logs set');

logs.use('/servicelogs', servicelogRoute);
log.info('ROUTE service logs set');

logs.use('/employeelogs', employeelogRoute);
log.info('ROUTE employee logs set');

// Purpose: for table
export default logs;
