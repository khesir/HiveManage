import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { EmployeeLogService } from './employeeLog.service';

export class EmployeeLogController {
  private employeelogService: EmployeeLogService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.employeelogService = new EmployeeLogService(pool);
  }

  async getEmployeeLog(req: Request, res: Response, next: NextFunction) {
    const employee_id = (req.params.employee_id as string) || undefined;
    const no_pagination = req.query.no_pagination == 'true';
    const sort = (req.query.sort as string) || 'asc';
    const limit = Number(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    try {
      const data = await this.employeelogService.getAllEmployeeLog(
        employee_id,
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
        data: data.employeelogWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createEmployeeLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id, action, quantity, performed_by } = req.body;

      await this.employeelogService.createEmployeeLog({
        employee_id,
        action,
        quantity,
        performed_by,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Employee Log ',
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
