import { Router } from 'express';
import { db } from '@/drizzle/pool';
import { validateRequest } from '@/src/middlewares';
import assignedEmployeeRoute from './assignedemployees/assignedemployees.route';
import { ServiceController } from './service.controller';
import { validateServiceID } from './service.middleware';
import { CreateService, UpdateService } from './service.model';
import reportsRoute from './tickets/reports/reports.route';
import ticketsRoute from './tickets/ticket.route';
import tickettypesRoute from './ticketType/tickettype.route';
import servicetypesRoute from './servicetype/servicetype.route';
import serviceitemsRoute from './serviceitem/serviceitem.route';

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

serviceRoute.use('/:service_id/reports', validateServiceID, reportsRoute);

serviceRoute.use(
  '/:service_id/assigned-employee',
  validateServiceID,
  assignedEmployeeRoute,
);

serviceRoute.use('/:service_id/tickets', validateServiceID, ticketsRoute);

serviceRoute.use(
  '/:service_id/tickettype',
  validateServiceID,
  tickettypesRoute,
);

serviceRoute.use(
  '/:service_id/serviceType',
  validateServiceID,
  servicetypesRoute,
);

serviceRoute.use(
  '/:service_id/serviceitem',
  validateServiceID,
  serviceitemsRoute,
);

export default serviceRoute;
