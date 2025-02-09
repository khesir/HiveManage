import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { PositionService } from './position.service';
import { SchemaType } from '@/drizzle/schema/type';

export class PositionController {
  private positionService: PositionService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.positionService = new PositionService(pool);
  }

  async getAllPosition(req: Request, res: Response, next: NextFunction) {
    const limit = parseInt(req.query.limit as string) || 10; // default limit value
    const offset = parseInt(req.query.offset as string) || 0; // default offset value
    try {
      // Fetch data count from the database
      const data = await this.positionService.getAllPosition(limit, offset);
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

  async getPositionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { position_id } = req.params;
      const data = await this.positionService.getPositionById(
        Number(position_id),
      );
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createPosition(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      await this.positionService.createPosition({
        name,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Position ',
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

  async updatePosition(req: Request, res: Response, next: NextFunction) {
    try {
      const { position_id } = req.params;
      const { name } = req.body;

      await this.positionService.updatePosition({ name }, Number(position_id));
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Position Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deletePosition(req: Request, res: Response, next: NextFunction) {
    try {
      const { position_id } = req.params;
      await this.positionService.deletePosition(Number(position_id));
      res.status(200).json({
        status: 'Success',
        message: `Position ID:${position_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
