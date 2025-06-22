import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Request, Response, NextFunction } from 'express';
import { RepairService } from './repair.service';
import { SchemaType } from '@/drizzle/schema/type';
import { HttpStatus } from '@/lib/HttpStatus';

export class RepairController {
  private repairService: RepairService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.repairService = new RepairService(pool);
  }
  async getAllRepair(req: Request, res: Response, next: NextFunction) {
    const no_pagination = req.query.no_pagination === 'true';
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.repairService.getAllRepair(
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
        data: data.repairDetailsWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }
  async getRepairById(req: Request, res: Response, next: NextFunction) {
    const { repair_id } = req.params;
    try {
      const data = await this.repairService.getRepairById(Number(repair_id));
      res.status(HttpStatus.OK.code).json({ status: 'Sucess', data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }
  async createRepair(req: Request, res: Response, next: NextFunction) {
    const {
      repair_details_id,
      service_id,
      parts_used,
      diagnostic_notes,
      work_done,
    } = req.body;
    try {
      await this.repairService.createRepair({
        repair_details_id,
        service_id,
        parts_used,
        diagnostic_notes,
        work_done,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Repair Details ',
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

  async UpdateRepair(req: Request, res: Response, next: NextFunction) {
    const { repair_id } = req.params;
    const {
      repair_details_id,
      service_id,
      parts_used,
      diagnostic_notes,
      work_done,
    } = req.body;
    try {
      await this.repairService.updateRepair(
        {
          repair_details_id,
          service_id,
          parts_used,
          diagnostic_notes,
          work_done,
        },
        Number(repair_id),
      );
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Repair Details ',
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
  async deleteRepair(req: Request, res: Response, next: NextFunction) {
    const { service_id } = req.params;
    try {
      await this.repairService.deleteRepair(Number(service_id));
      res.status(200).json({
        status: 'Success',
        message: `Service ID:${service_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
