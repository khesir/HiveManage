import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { JobOrderService } from './joborder.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/drizzle.config';

export class JobOrderController {
  private joborderService: JobOrderService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.joborderService = new JobOrderService(pool);
  }

  async getAllJobOrder(req: Request, res: Response, next: NextFunction) {
    const no_pagination = req.query.no_pagination === 'true';
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const uuid = (req.query.uuid as string) || undefined;
    const service_id = (req.params.service_id as string) || undefined;
    const joborder_status = (req.query.joborder_status as string) || undefined;
    const employee_id = (req.query.employee_id as string) || undefined;

    try {
      const data = await this.joborderService.getAllJobOrder(
        no_pagination,
        sort,
        limit,
        offset,
        uuid,
        service_id,
        joborder_status,
        employee_id,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.totalData,
        limit: limit,
        offset: offset,
        data: data.joborderitemWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getJobOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { job_order_id } = req.params;
      const data = await this.joborderService.getJobOrderById(
        Number(job_order_id),
      );
      res.status(200).json({ status: 'Success', data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createJobOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const service_id = Number(req.params.service_id);
      const { joborder_type_id, uuid, fee, joborder_status, total_price_cost } =
        req.body;

      await this.joborderService.createJobOrder({
        joborder_type_id,
        service_id,
        uuid,
        fee,
        joborder_status,
        total_price_cost,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Job Order ',
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

  async updateJobOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { job_order_id } = req.params;
      const service_id = Number(req.params.service_id);
      const { joborder_type_id, uuid, fee, joborder_status, total_price_cost } =
        req.body;

      await this.joborderService.updateJobOrder(
        {
          joborder_type_id,
          service_id,
          uuid,
          fee,
          joborder_status,
          total_price_cost,
        },
        Number(job_order_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Job Order Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteJobOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { job_order_id } = req.params;
      await this.joborderService.deleteJobOrder(Number(job_order_id));
      res.status(200).json({
        status: 'Success',
        message: `Job Order ID:${job_order_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
