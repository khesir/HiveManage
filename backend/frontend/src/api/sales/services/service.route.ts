import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';
import assignedEmployeeRoute from './assignedemployees/assignedemployees.route';
import { ServiceController } from './service.controller';
import { validateServiceID } from './service.middleware';
import { CreateService, UpdateService } from './service.model';
import ticketsRoute from './tickets/ticket.route';
import tickettypesRoute from './ticketType/tickettype.route';
import transerviceitemsRoute from './transactionServiceItem/transerviceitem.route';

const serviceRoute = Router({ mergeParams: true });
const serviceController = new ServiceController(db);

serviceRoute.get('/', serviceController.getAllServices.bind(serviceController));

serviceRoute.get(
  '/:service_id',
  validateServiceID,
  serviceController.getServiceById.bind(serviceController),
);

serviceRoute.post(
  '/',
  [validateRequest({ body: CreateService })],
  serviceController.createServices.bind(serviceController),
);

serviceRoute.put(
  '/:service_id',
  [validateRequest({ body: UpdateService }), validateServiceID],
  serviceController.updateService.bind(serviceController),
);

serviceRoute.delete(
  '/:service_id',
  validateServiceID,
  serviceController.deleteService.bind(serviceController),
);

serviceRoute.use(
  '/:service_id/assigned-employee',
  validateServiceID,
  assignedEmployeeRoute,
);

serviceRoute.use('/:service_id/ticket', validateServiceID, ticketsRoute);

serviceRoute.use(
  '/:service_id/ticket-type',
  validateServiceID,
  tickettypesRoute,
);

serviceRoute.use(
  '/:transaction_service_Record/service-item',
  validateServiceID,
  transerviceitemsRoute,
);

export default serviceRoute;
