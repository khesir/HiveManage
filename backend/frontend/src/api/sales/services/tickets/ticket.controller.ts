import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { TicketsService } from './ticket.service';

export class TicketsController {
  private ticketService: TicketsService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.ticketService = new TicketsService(pool);
  }

  async getAllTickets(req: Request, res: Response, next: NextFunction) {
    const service_id = req.params.service_id as string;
    const ticket_status = (req.query.ticket_status as string) || undefined;
    const no_pagination = req.query.no_pagination === 'true';
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.ticketService.getAllTickets(
        no_pagination,
        service_id,
        ticket_status,
        sort,
        limit,
        offset,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.totalData,
        limit: limit,
        offset: offset,
        data: data.ticketitemWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getTicketsById(req: Request, res: Response, next: NextFunction) {
    try {
      const { ticket_id } = req.params;
      const data = await this.ticketService.getTicketsByID(ticket_id);
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        ticket_type_id,
        service_id,
        title,
        description,
        content,
        ticket_status,
        deadline,
      } = req.body;

      await this.ticketService.createTickets({
        ticket_type_id,
        service_id,
        title,
        description,
        content,
        ticket_status,
        deadline,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Tickets ',
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

  async updateTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const { ticket_id } = req.params;
      const {
        ticket_type_id,
        service_id,
        title,
        description,
        content,
        remarktickets_status,
        deadline,
      } = req.body;

      await this.ticketService.updateTickets(
        {
          ticket_type_id,
          service_id,
          title,
          description,
          content,
          remarktickets_status,
          deadline,
        },
        Number(ticket_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Tickets Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const { ticket_id } = req.params;
      await this.ticketService.deleteTickets(Number(ticket_id));
      res.status(200).json({
        status: 'Success',
        message: `Tickets ID:${ticket_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
