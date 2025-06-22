import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Request, Response, NextFunction } from 'express';
import { BuildService } from './build.service';
import { SchemaType } from '@/drizzle/schema/type';
import { HttpStatus } from '@/lib/HttpStatus';

export class BuildController {
  private buildService: BuildService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.buildService = new BuildService(pool);
  }
  async getAllBuild(req: Request, res: Response, next: NextFunction) {
    const no_pagination = req.query.no_pagination === 'true';
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.buildService.getAllBuild(
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
        data: data.buildDetailsWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }
  async getBuildById(req: Request, res: Response, next: NextFunction) {
    const { build_id } = req.params;
    try {
      const data = await this.buildService.getBuildById(Number(build_id));
      res.status(HttpStatus.OK.code).json({ status: 'Sucess', data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }
  async createBuild(req: Request, res: Response, next: NextFunction) {
    const { service_id, customer_items, parts_used, build_specs, checklist } =
      req.body;
    try {
      await this.buildService.createBuild({
        service_id,
        customer_items,
        parts_used,
        build_specs,
        checklist,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created build Details ',
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

  async updateBuild(req: Request, res: Response, next: NextFunction) {
    const { build_id } = req.params;
    const { service_id, customer_items, parts_used, build_specs, checklist } =
      req.body;
    try {
      await this.buildService.updateBuild(
        {
          service_id,
          customer_items,
          parts_used,
          build_specs,
          checklist,
        },
        Number(build_id),
      );
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created build Details ',
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
  async deleteBuild(req: Request, res: Response, next: NextFunction) {
    const { service_id } = req.params;
    try {
      await this.buildService.deletebuild(Number(service_id));
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
