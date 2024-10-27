import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/drizzle.schema';
import { RemarkReportsService } from './remarkreports.service';

export class RemarkReportsController {
  private remarkreportsService: RemarkReportsService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.remarkreportsService = new RemarkReportsService(pool);
  }

  async getAllRemarkReports(req: Request, res: Response, next: NextFunction) {
    const remark_id = (req.params.remark_id as string) || undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.remarkreportsService.getAllRemarkReports(
        remark_id,
        limit,
        offset,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.totalData,
        limit: limit,
        offset: offset,
        data: data.remarkreportsWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getRemarkReportsById(req: Request, res: Response, next: NextFunction) {
    try {
      const { remark_reports_id } = req.params;
      const data = await this.remarkreportsService.getRemarkReportsById(
        Number(remark_reports_id),
      );
      res.status(200).json({ status: 'Success', data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createRemarkReports(req: Request, res: Response, next: NextFunction) {
    try {
      const remark_id = Number(req.params.service_id);
      const { reports_id } = req.body;

      await this.remarkreportsService.createRemarkReports({
        remark_id,
        reports_id,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Remark Reports ',
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

  async updateRemarkReports(req: Request, res: Response, next: NextFunction) {
    try {
      const { remark_reports_id } = req.params;
      const remark_id = Number(req.params.remark_id);
      const { reports_id } = req.body;

      await this.remarkreportsService.updateRemarkReports(
        { reports_id, remark_id },
        Number(remark_reports_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Remark Reports Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteRemarkReports(req: Request, res: Response, next: NextFunction) {
    try {
      const { remark_reports_id } = req.params;
      await this.remarkreportsService.deleteRemarkReports(
        Number(remark_reports_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Remark Reports ID:${remark_reports_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
