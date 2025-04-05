import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { ServiceLogService } from './serviceLog.service';

export class ServiceLogController {
  private servicelogService: ServiceLogService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.servicelogService = new ServiceLogService(pool);
  }

  async getSalesLog(req: Request, res: Response, next: NextFunction) {
    const service_id = (req.params.service_id as string) || undefined;
    const ticket_id = (req.params.ticket_id as string) || undefined;
    const report_id = (req.params.report_id as string) || undefined;
    const service_item_id = (req.params.service_item_id as string) || undefined;
    const payment_id = (req.params.payment_id as string) || undefined;
    const no_pagination = req.query.no_pagination == 'true';
    const sort = (req.query.sort as string) || 'asc';
    const limit = Number(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    try {
      const data = await this.servicelogService.getAllServiceLog(
        service_id,
        ticket_id,
        report_id,
        service_item_id,
        payment_id,
        no_pagination,
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
        data: data.servicelogWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createSalesLog(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        service_id,
        ticket_id,
        report_id,
        service_item_id,
        payment_id,
        action,
        quantity,
        performed_by,
      } = req.body;

      await this.servicelogService.createServiceLog({
        service_id,
        ticket_id,
        report_id,
        service_item_id,
        payment_id,
        action,
        quantity,
        performed_by,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Service Log ',
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
}
