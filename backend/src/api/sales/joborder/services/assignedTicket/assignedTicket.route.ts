import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import { validateAssignedTicketeID } from './assignedTicket.middleware';
import { AssignedTicketController } from './assignedTicket.controller';
import {
  CreateAssignedTicket,
  UpdatedAssignedTicket,
} from './assignedTicket.model';

const assignedTicketRoute = Router({ mergeParams: true });
const assignedTicketController = new AssignedTicketController(db);

assignedTicketRoute.get(
  '/',
  assignedTicketController.getAllAssignedTicket.bind(assignedTicketController),
);

assignedTicketRoute.get(
  '/:assigned_ticket_id',
  validateAssignedTicketeID,
  assignedTicketController.getAssignedTicketById.bind(assignedTicketController),
);

assignedTicketRoute.post(
  '/',
  [validateRequest({ body: CreateAssignedTicket })],
  assignedTicketController.createAssignedTicket.bind(assignedTicketController),
);

assignedTicketRoute.put(
  '/:assigned_ticket_id',
  [validateRequest({ body: UpdatedAssignedTicket }), validateAssignedTicketeID],
  assignedTicketController.updateAssignedTicket.bind(assignedTicketController),
);

assignedTicketRoute.delete(
  '/:assigned_ticket_id',
  validateAssignedTicketeID,
  assignedTicketController.deleteAssignedTicket.bind(assignedTicketController),
);

export default assignedTicketRoute;
