import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { TicketsController } from './ticket.controller';
import { validateTicketsID } from './ticket.middleware';
import { CreateTickets, UpdateTickets } from './ticket.model';

const ticketsRoute = Router({ mergeParams: true });
const ticketsController = new TicketsController(db);

ticketsRoute.get('/', ticketsController.getAllTickets.bind(ticketsController));

ticketsRoute.get(
  '/:ticket_id',
  validateTicketsID,
  ticketsController.getTicketsById.bind(ticketsController),
);

ticketsRoute.post(
  '/',
  [validateRequest({ body: CreateTickets })],
  ticketsController.createTickets.bind(ticketsController),
);

ticketsRoute.put(
  '/:ticket_id',
  [validateRequest({ body: UpdateTickets }), validateTicketsID],
  ticketsController.updateTickets.bind(ticketsController),
);

ticketsRoute.delete(
  '/:ticket_id',
  validateTicketsID,
  ticketsController.deleteTickets.bind(ticketsController),
);

export default ticketsRoute;
