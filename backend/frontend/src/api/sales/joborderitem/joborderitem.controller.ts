import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { JobOrderItemService } from './joborderitem.service';

export class JobOrderItemsController {
  private joborderitemService: JobOrderItemService;

  constructor(pool: PostgresJsDatabase) {
    this.joborderitemService = new JobOrderItemService(pool);
  }

  async getAllJobOrderItems(req: Request, res: Response, next: NextFunction) {
    const id = (req.query.id as string) || undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.joborderitemService.getAllJobOrderItems(
        id,
        limit,
        offset,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.totalData,
        limit: limit,
        offset: offset,
        data: data.JobOrderItemsDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getJobOrderItemsById(req: Request, res: Response, next: NextFunction) {
    try {
      const { joborderitems_id } = req.params;
      const data =
        await this.joborderitemService.getJobOrderItemsByID(joborderitems_id);
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createJobOrderItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { item_id, job_order_id, quantity } = req.body;

      await this.joborderitemService.createJobOrderItems({
        item_id,
        job_order_id,
        quantity,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Job Order Items ',
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

  async updateJobOrderItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { joborderitems_id } = req.params;
      const { item_id, job_order_id, quantity } = req.body;

      await this.joborderitemService.updateJobOrderItems(
        { item_id, job_order_id, quantity },
        Number(joborderitems_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Job Order Items Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteJobOrderItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { joborderitems_id } = req.params;
      await this.joborderitemService.deleteJobOrderItems(
        Number(joborderitems_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Job Order Items ID:${joborderitems_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
