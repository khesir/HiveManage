import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { TicketTypesController } from './tickettype.controller';
import { validateTicketTypeID } from './tickettype.middleware';
import { CreateTicketType, UpdateTicketType } from './tickettype.model';

const tickettypesRoute = Router({ mergeParams: true });
const tickettypesController = new TicketTypesController(db);

tickettypesRoute.get(
  '/',
  tickettypesController.getAllTicketTypes.bind(tickettypesController),
);
log.info('GET /tickettypes set');

tickettypesRoute.get(
  '/:ticket_type_id',
  validateTicketTypeID,
  tickettypesController.getTicketTypesById.bind(tickettypesController),
);
log.info('GET /tickettypes/:ticket_type_id set');

tickettypesRoute.patch(
  '/:ticket_type_id',
  [validateRequest({ body: CreateTicketType })],
  tickettypesController.createTicketTypes.bind(tickettypesController),
);
log.info('POST /tickettypes/ set ');

tickettypesRoute.put(
  '/:ticket_type_id',
  [validateRequest({ body: UpdateTicketType }), validateTicketTypeID],
  tickettypesController.updateTicketTypes.bind(tickettypesController),
);
log.info('PUT /tickettypes/:ticket_type_id set ');

tickettypesRoute.delete(
  '/:ticket_type_id',
  validateTicketTypeID,
  tickettypesController.deleteTicketTypes.bind(tickettypesController),
);
log.info('DELETE /tickettypes/:ticket_type_id set');

export default tickettypesRoute;
