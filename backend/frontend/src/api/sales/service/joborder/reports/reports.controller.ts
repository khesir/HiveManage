import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { ReportsService } from './reports.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class ReportsController {
  private reportsService: ReportsService;

  constructor(pool: PostgresJsDatabase) {
    this.reportsService = new ReportsService(pool);
  }

  async getAllReports(req: Request, res: Response, next: NextFunction) {
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.reportsService.getAllReports(sort, limit, offset);
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.reportsWithDetails,
        limit: limit,
        offset: offset,
        data: data,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getReportsById(req: Request, res: Response, next: NextFunction) {
    try {
      const { reports_id } = req.params;
      const data = await this.reportsService.getReportsById(Number(reports_id));
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createReports(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer_id, job_order_id, reports_title, remarks } = req.body;

      await this.reportsService.createReports({
        customer_id,
        job_order_id,
        reports_title,
        remarks,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Reports ',
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

  async updateReports(req: Request, res: Response, next: NextFunction) {
    try {
      const { reports_id } = req.params;
      const { customer_id, job_order_id, reports_title, remarks } = req.body;

      await this.reportsService.updateReports(
        { customer_id, job_order_id, reports_title, remarks },
        Number(reports_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Reports Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteReports(req: Request, res: Response, next: NextFunction) {
    try {
      const { reports_id } = req.params;
      await this.reportsService.deleteReports(Number(reports_id));
      res.status(200).json({
        status: 'Success',
        message: `Reports ID:${reports_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
