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
import ownedServiceItemsRoute from './ownedItems/ownedItems.route';
import serviceReturnRoute from './serviceReturn/serviceReturn.route';
import buildRoute from './details/building/build.route';
import cleaningRoute from './details/cleaning/cleaning.route';
import rentRoute from './details/rent/rent.route';
import repairRoute from './details/repair/repair.route';
import replacementRoute from './details/replacement/replacement.route';
import upgradeRoute from './details/upgrade/upgrade.route';

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

serviceRoute.use(
  '/:service_id/owned-items',
  validateServiceID,
  ownedServiceItemsRoute,
);

serviceRoute.use('/:service_id/return', validateServiceID, serviceReturnRoute);

serviceRoute.use('/:service_id/build-details', validateServiceID, buildRoute);

serviceRoute.use(
  '/:service_id/cleaning-details',
  validateServiceID,
  cleaningRoute,
);

serviceRoute.use('/:service_id/rent-details', validateServiceID, rentRoute);

serviceRoute.use('/:service_id/repair-details', validateServiceID, repairRoute);

serviceRoute.use(
  '/:service_id/replacement-details',
  validateServiceID,
  replacementRoute,
);

serviceRoute.use(
  '/:service_id/upgrade-details',
  validateServiceID,
  upgradeRoute,
);

export default serviceRoute;
