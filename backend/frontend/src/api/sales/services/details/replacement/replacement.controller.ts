import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Request, Response, NextFunction } from 'express';
import { ReplacementService } from './replacement.service';
import { SchemaType } from '@/drizzle/schema/type';
import { HttpStatus } from '@/lib/HttpStatus';

export class ReplacementController {
  private replacementService: ReplacementService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.replacementService = new ReplacementService(pool);
  }
  async getAllReplacement(req: Request, res: Response, next: NextFunction) {
    const no_pagination = req.query.no_pagination === 'true';
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.replacementService.getAllReplacement(
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
        data: data.ReplacementDetailsWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }
  async getReplacementById(req: Request, res: Response, next: NextFunction) {
    const { Replacement_id } = req.params;
    try {
      const data = await this.replacementService.getReplacementById(
        Number(Replacement_id),
      );
      res.status(HttpStatus.OK.code).json({ status: 'Sucess', data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }
  async createReplacement(req: Request, res: Response, next: NextFunction) {
    const { replacement_id, service_id, owned_items, new_product, reason } =
      req.body;
    try {
      await this.replacementService.createReplacement({
        replacement_id,
        service_id,
        owned_items,
        new_product,
        reason,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Replacement Details ',
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

  async updateReplacement(req: Request, res: Response, next: NextFunction) {
    const { replacement_id } = req.params;
    const { service_id, owned_items, new_product, reason } = req.body;
    try {
      await this.replacementService.updateReplacement(
        {
          service_id,
          owned_items,
          new_product,
          reason,
        },
        Number(replacement_id),
      );
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Replacement Details ',
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
  async deleteReplacement(req: Request, res: Response, next: NextFunction) {
    const { service_id } = req.params;
    try {
      await this.replacementService.deleteReplacement(Number(service_id));
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
