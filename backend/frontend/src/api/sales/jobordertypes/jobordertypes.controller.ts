import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { JobOrderTypeService } from './jobordertypes.service';

export class JobOrderTypesController {
  private jobordertypesService: JobOrderTypeService;

  constructor(pool: PostgresJsDatabase) {
    this.jobordertypesService = new JobOrderTypeService(pool);
  }

  async getAllJobOrderTypes(req: Request, res: Response, next: NextFunction) {
    const limit = parseInt(req.query.limit as string) || 10; // default limit value
    const offset = parseInt(req.query.offset as string) || 0; // default offset value
    try {
      // Fetch data count from the database
      const data = await this.jobordertypesService.getAllJobOrderTypes(
        limit,
        offset,
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data retrieved successfully',
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
      const { joborder_type_id } = req.params;
      const data = await this.jobordertypesService.getJobOrderTypesById(
        Number(joborder_type_id),
      );
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createJobOrderTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description, joborder_types_status } = req.body;

      await this.jobordertypesService.createJobOrderTypes({
        name,
        description,
        joborder_types_status,
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

  async updateJobOrderTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const { joborder_types_id } = req.params;
      const { name, description, joborder_types_status } = req.body;

      await this.jobordertypesService.updateJobOrderTypes(
        { name, description, joborder_types_status },
        Number(joborder_types_id),
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

  async deleteJobOrderTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const { joborder_type_id } = req.params;
      await this.jobordertypesService.deleteJobOrderTypes(
        Number(joborder_type_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Job Order ID:${joborder_type_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
