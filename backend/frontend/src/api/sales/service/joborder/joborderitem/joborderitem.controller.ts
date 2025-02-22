import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { JobOrderItemService } from './joborderitem.service';

export class JobOrderItemController {
  private joborderitemService: JobOrderItemService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.joborderitemService = new JobOrderItemService(pool);
  }

  async getAllJobOrderItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { product_id } = req.params || undefined;
      const job_order_id = (req.query.employee_id as string) || undefined;
      const data = await this.joborderitemService.getAllJobOrderItem(
        product_id,
        job_order_id,
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

  async getJobOrderItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const { product_id } = req.params;
      const { job_order_id } = req.params;
      const data = await this.joborderitemService.getAllJobOrderItemByID(
        product_id,
        job_order_id,
      );
      res.status(200).json({ status: 'Success', data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createJobOrderItem(req: Request, res: Response, next: NextFunction) {
    try {
      const product_id = Number(req.params.product_id);
      const { job_order_id, status, quantity } = req.body;

      await this.joborderitemService.createJobOrderItem({
        product_id,
        job_order_id,
        status,
        quantity,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Job Order Item ',
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

  async updateJobOrderItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { job_order_item_id } = req.params;
      const { product_id, job_order_id, status, quantity } = req.body;

      await this.joborderitemService.updateJobOrderItem(
        { product_id, job_order_id, status, quantity },
        Number(job_order_item_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Job Order Item Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteJobOrderItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { job_order_item_id } = req.params;
      await this.joborderitemService.deleteJobOrderItem(
        Number(job_order_item_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Job Order Item ID:${job_order_item_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
