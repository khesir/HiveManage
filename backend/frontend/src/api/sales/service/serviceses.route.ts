import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { ServiceController } from './serviceses.controller';
import { validateServiceID } from './serviceses.middleware';
import { CreateService, UpdateService } from './serviceses.model';
import joborderRoute from './joborder/joborder.route';
import borrowRoute from './borrow/borrow.route';
import reserveRoute from './reserve/reserve.route';
import receiptRoute from './receipt/receipt.route';
import paymentRoute from './payment/payment.route';
import customerRoute from '../../cms/customer/customer.route';
import salesitemRoute from './salesItem/salesItem.route';

const serviceRoute = Router({ mergeParams: true });
const serviceController = new ServiceController(db);

serviceRoute.get('/', serviceController.getAllService.bind(serviceController));
log.info('GET /service set');

serviceRoute.get(
  '/:service_id',
  validateServiceID,
  serviceController.getServiceById.bind(serviceController),
);
log.info('GET /service/:service_id set');

serviceRoute.post(
  '/',
  [validateRequest({ body: CreateService })],
  serviceController.createService.bind(serviceController),
);
log.info('POST /service/ set ');

serviceRoute.put(
  '/:service_id',
  [validateRequest({ body: UpdateService }), validateServiceID],
  serviceController.updateService.bind(serviceController),
);
log.info('PUT /service/:service_id set ');

serviceRoute.delete(
  '/:service_id',
  validateServiceID,
  serviceController.deleteService.bind(serviceController),
);
log.info('DELETE /service/:service_id set');

serviceRoute.use('/:service_id/payment', validateServiceID, paymentRoute);
serviceRoute.use('/:service_id/receipt', validateServiceID, receiptRoute);
serviceRoute.use('/:service_id/joborder', validateServiceID, joborderRoute);
serviceRoute.use('/:service_id/borrow', validateServiceID, borrowRoute);
serviceRoute.use('/:service_id/reserve', validateServiceID, reserveRoute);
serviceRoute.use('/:service_id/customer', validateServiceID, customerRoute);
serviceRoute.use('/:service_id/sales-item', validateServiceID, salesitemRoute);
log.info('ROUTE salesitem set');

export default serviceRoute;
