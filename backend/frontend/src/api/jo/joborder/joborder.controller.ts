import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { JobOrderService } from './joborder.service';

export class JobOrderController {
  private joborderService: JobOrderService;

  constructor(pool: MySql2Database) {
    this.joborderService = new JobOrderService(pool);
  }

  async getAllJobOrder(req: Request, res: Response, next: NextFunction) {
    const id = (req.query.id as string) || undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.joborderService.getAllJobOrder(id, limit, offset);
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.length,
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

  async getJobOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { job_order_id } = req.params;
      const data = await this.joborderService.getJobOrderById(
        Number(job_order_id),
      );
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createJobOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { employee_id, service_id, steps, required_items, status } =
        req.body;

      await this.joborderService.createJobOrder({
        employee_id,
        service_id,
        steps,
        required_items,
        status,
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
      const { employee_id, service_id, steps, required_items, status } =
        req.body;

      await this.joborderService.updateJobOrder(
        { employee_id, service_id, steps, required_items, status },
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
