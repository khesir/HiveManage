import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/drizzle.config';
import { JobOrderServicesService } from './joborderservice.service';

export class JobOrderServiceController {
  private joborderservicesService: JobOrderServicesService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.joborderservicesService = new JobOrderServicesService(pool);
  }

  async getAllJobOrderService(req: Request, res: Response, next: NextFunction) {
    const job_order_id = (req.params.job_order_id as string) || undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.joborderservicesService.getAllJobOrderServices(
        job_order_id,
        limit,
        offset,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.totalData,
        limit: limit,
        offset: offset,
        data: data.joborderserviceitemsWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getJobOrderServiceById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { joborder_services_id } = req.params;
      const data = await this.joborderservicesService.getJobOrderServicesById(
        Number(joborder_services_id),
      );
      res.status(200).json({ status: 'Success', data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createJobOrderService(req: Request, res: Response, next: NextFunction) {
    try {
      const joborder_type_id = Number(req.params.joborder_type_id);
      const { job_order_id } = req.body;

      await this.joborderservicesService.createJobOrderServices({
        joborder_type_id,
        job_order_id,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Job Order Service ',
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

  async updateJobOrderService(req: Request, res: Response, next: NextFunction) {
    try {
      const { joborder_services_id } = req.params;
      const joborder_type_id = Number(req.params.service_id);
      const { job_order_id } = req.body;

      await this.joborderservicesService.updateJobOrderServices(
        { joborder_type_id, job_order_id },
        Number(joborder_services_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Job Order Service Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteJobOrderService(req: Request, res: Response, next: NextFunction) {
    try {
      const { joborder_services_id } = req.params;
      await this.joborderservicesService.deleteJobOrderServices(
        Number(joborder_services_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Job Order Service ID:${joborder_services_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
