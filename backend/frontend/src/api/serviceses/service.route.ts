import { Router } from 'express';
import log from '@/lib/logger';
import serviceRoute from './serviceses/serviceses.route';
import assignedEmployeeRoute from './assignedemployees/assignedemployees.route';
import remarkTicketsRoute from './remarktickets/remarkticket.route';
import joborderItemsRoute from '../sales/joborderitem/joborderitem.route';

const srmsRoute = Router({ mergeParams: true });

srmsRoute.use('/service', serviceRoute);
log.info('ROUTE sales set ');

srmsRoute.use('/assignedemployee', assignedEmployeeRoute);
log.info('ROUTE assigned employee set');

srmsRoute.use('/remarktickets', remarkTicketsRoute);
log.info('ROUTE remark tickets set');

srmsRoute.use('/joborderitems', joborderItemsRoute);
log.info('ROUTE job order items set');
export default srmsRoute;
