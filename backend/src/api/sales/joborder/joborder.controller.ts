import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { JoborderService } from './joborder.service';

export class JoborderController {
  private jobrderService: JoborderService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.jobrderService = new JoborderService(pool);
  }

  async getAlljobrder(req: Request, res: Response, next: NextFunction) {
    const no_pagination = req.query.no_pagination === 'true';
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const status = (req.query.status as string) || undefined;
    const range = (req.query.range as string) || undefined;
    try {
      const data = await this.jobrderService.getAllJoborders(
        no_pagination,
        sort,
        limit,
        offset,
        status,
        range,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.totalData,
        limit: limit,
        offset: offset,
        data: data.joborderWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getJoborderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { joborder_id } = req.params;
      const data = await this.jobrderService.getJoborderById(
        Number(joborder_id),
      );
      res.status(200).json({ status: 'Success', data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createJoborder(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        customer_id,
        expected_completion_date,
        completed_at,
        turned_over_at,
        status,
        user_id,
        payment_id,
      } = req.body;
      await this.jobrderService.createJoborder({
        customer_id,
        expected_completion_date,
        completed_at,
        turned_over_at,
        status,
        user_id,
        payment_id,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Joborder ',
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

  async updateJoborder(req: Request, res: Response, next: NextFunction) {
    try {
      const { joborder_id } = req.params;
      const {
        customer_id,
        expected_completion_date,
        completed_at,
        turned_over_at,
        status,
        user_id,
        payment_id,
      } = req.body;

      await this.jobrderService.updateJoborder(
        {
          customer_id,
          expected_completion_date,
          completed_at,
          turned_over_at,
          status,
          user_id,
          payment_id,
        },
        Number(joborder_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Joborder Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteJoborder(req: Request, res: Response, next: NextFunction) {
    try {
      const { joborder_id } = req.params;
      await this.jobrderService.deleteJoborder(Number(joborder_id));
      res.status(200).json({
        status: 'Success',
        message: `Joborder ID:${joborder_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
  async payment(req: Request, res: Response, next: NextFunction) {
    try {
      const { joborder_id } = req.params;
      const { payment, user_id } = req.body;
      await this.jobrderService.payment(
        { payment, user_id, status: 'Completed' },
        Number(joborder_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Joborder ID:${joborder_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
