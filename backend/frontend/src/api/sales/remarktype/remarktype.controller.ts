import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/drizzle.schema';
import { RemarkTypeService } from './remarktype.service';

export class RemarkTypesController {
  private remarktypeService: RemarkTypeService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.remarktypeService = new RemarkTypeService(pool);
  }

  async getAllRemarkTypes(req: Request, res: Response, next: NextFunction) {
    const limit = parseInt(req.query.limit as string) || 10; // default limit value
    const offset = parseInt(req.query.offset as string) || 0; // default offset value
    try {
      // Fetch data count from the database
      const data = await this.remarktypeService.getAllRemarkType(limit, offset);
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

  async getRemarkTypesById(req: Request, res: Response, next: NextFunction) {
    try {
      const { remark_type_id } = req.params;
      const data = await this.remarktypeService.getRemarkTypeById(
        Number(remark_type_id),
      );
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createRemarkTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, description } = req.body;

      await this.remarktypeService.createRemarkType({
        name,
        description,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Remark Type ',
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

  async updateRemarkTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const { remark_type_id } = req.params;
      const { name, description } = req.body;

      await this.remarktypeService.updateRemarkType(
        { name, description },
        Number(remark_type_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Remark Type Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteRemarkTypes(req: Request, res: Response, next: NextFunction) {
    try {
      const { remark_type_id } = req.params;
      await this.remarktypeService.deleteRemarkType(Number(remark_type_id));
      res.status(200).json({
        status: 'Success',
        message: `Remark Type ID:${remark_type_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
