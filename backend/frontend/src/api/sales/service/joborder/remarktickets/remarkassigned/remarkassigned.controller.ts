import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/drizzle.schema';
import { RemarkAssignedService } from './remarkassigned.service';

export class RemarkAssignedController {
  private remarkassignedService: RemarkAssignedService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.remarkassignedService = new RemarkAssignedService(pool);
  }

  async getAllRemarkAssigned(req: Request, res: Response, next: NextFunction) {
    const remark_id = (req.params.remark_id as string) || undefined;
    const employee_id = (req.query.employee_id as string) || undefined;
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.remarkassignedService.getAllRemarkAssigned(
        remark_id,
        employee_id,
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
        data: data.remarkassigneditemWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getRemarkAssignedById(req: Request, res: Response, next: NextFunction) {
    try {
      const { remarkassigned_id } = req.params;
      const data = await this.remarkassignedService.getRemarkAssignedById(
        Number(remarkassigned_id),
      );
      res.status(200).json({ status: 'Success', data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createRemarkAssigned(req: Request, res: Response, next: NextFunction) {
    try {
      const employee_id = Number(req.params.employee_id);
      const { remark_id } = req.body;

      await this.remarkassignedService.createRemarkAssigned({
        remark_id,
        employee_id,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Remark Assigned ',
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

  async updateRemarkAssigned(req: Request, res: Response, next: NextFunction) {
    try {
      const { remarkassigned_id } = req.params;
      const employee_id = Number(req.params.employee_id);
      const { remark_id } = req.body;

      await this.remarkassignedService.updateRemarkAssigned(
        { remark_id, employee_id },
        Number(remarkassigned_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Remark Assigned Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteRemarkAssigned(req: Request, res: Response, next: NextFunction) {
    try {
      const { remarkassigned_id } = req.params;
      await this.remarkassignedService.deleteRemarkAssigned(
        Number(remarkassigned_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Remark Assigned ID:${remarkassigned_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
