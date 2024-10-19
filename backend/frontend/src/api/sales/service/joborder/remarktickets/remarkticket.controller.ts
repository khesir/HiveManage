import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { RemarkTicketsService } from './remarkticket.service';

export class RemarkTicketsController {
  private remarkticketService: RemarkTicketsService;

  constructor(pool: PostgresJsDatabase) {
    this.remarkticketService = new RemarkTicketsService(pool);
  }

  async getAllRemarkTickets(req: Request, res: Response, next: NextFunction) {
    const remark_type = (req.query.remark_type as string) || 'false';
    const remarktickets_status =
      (req.query.remarktickets_status as string) || 'false';
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.remarkticketService.getAllRemarkTickets(
        remark_type,
        remarktickets_status,
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
        data: data.RemarkTicketsDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getRemarkTicketsById(req: Request, res: Response, next: NextFunction) {
    try {
      const { remark_id } = req.params;
      const data =
        await this.remarkticketService.getRemarkTicketsByID(remark_id);
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createRemarkTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        job_order_id,
        created_by,
        remark_type,
        description,
        remarktickets_status,
      } = req.body;

      await this.remarkticketService.createRemarkTickets({
        job_order_id,
        created_by,
        remark_type,
        description,
        remarktickets_status,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Remark Tickets ',
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

  async updateRemarkTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const { remark_id } = req.params;
      const {
        job_order_id,
        created_by,
        remark_type,
        description,
        remarktickets_status,
      } = req.body;

      await this.remarkticketService.updateRemarkTickets(
        {
          job_order_id,
          created_by,
          remark_type,
          description,
          remarktickets_status,
        },
        Number(remark_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Remark Tickets Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteRemarkTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const { remark_id } = req.params;
      await this.remarkticketService.deleteRemarkTickets(Number(remark_id));
      res.status(200).json({
        status: 'Success',
        message: `Remark Tickets ID:${remark_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
