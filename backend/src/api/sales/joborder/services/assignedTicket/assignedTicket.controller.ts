import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { AssignedTicketService } from './assignedTicket.service';
import { SchemaType } from '@/drizzle/schema/type';

export class AssignedTicketController {
  private assignedTicketService: AssignedTicketService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.assignedTicketService = new AssignedTicketService(pool);
  }

  async getAllAssignedTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const { service_id } = req.params || undefined;
      const ticket_id = (req.query.ticket_id as string) || undefined;
      const data = await this.assignedTicketService.getAllAssignedTicket(
        service_id,
        ticket_id,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        data: data,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getAssignedTicketById(req: Request, res: Response, next: NextFunction) {
    try {
      const { assigned_ticket_id } = req.params;
      const data =
        await this.assignedTicketService.getAssignTicketByID(
          assigned_ticket_id,
        );
      res.status(200).json({ status: 'Success', data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createAssignedTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const { ticket_id, employee_id } = req.body;

      await this.assignedTicketService.createAssignedTicket({
        ticket_id,
        employee_id,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Assigned Tickets ',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        status: 'Error ',
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async updateAssignedTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const { assigned_ticket_id } = req.params;
      const { service_id, ticket_id, assigned_by } = req.body;

      await this.assignedTicketService.updateAssignedTicket(
        { service_id, ticket_id, assigned_by },
        Number(assigned_ticket_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Assigned Tickets Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteAssignedTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const { assigned_Ticket_id } = req.params;
      await this.assignedTicketService.deleteAssignedTicket(
        Number(assigned_Ticket_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Assigned Ticket ID:${assigned_Ticket_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
