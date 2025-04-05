import { Router } from 'express';
import log from '@/lib/logger';
import servicelogRoute from './ServiceLogs/serviceLog.route';
import saleslogRoute from './SalesLogs/salesLog.route';
import employeelogRoute from './EmployeeLogs/employeeLog.route';
import orderlogRoute from './OrderTransLogs/OTL.route';
import productlogRoute from './ProductTransLogs/PTL.route';

const logs = Router({ mergeParams: true });

// Business_logic
logs.use('/productlogs', productlogRoute);
log.info('ROUTE product logs set');

logs.use('/orderlogs', orderlogRoute);
log.info('ROUTE order logs set');

logs.use('/servicelogs', servicelogRoute);
log.info('ROUTE service logs set');

logs.use('/saleslogs', saleslogRoute);
log.info('ROUTE sales logs set');

logs.use('/employeelogs', employeelogRoute);
log.info('ROUTE employee logs set');

// Purpose: for table
export default logs;
