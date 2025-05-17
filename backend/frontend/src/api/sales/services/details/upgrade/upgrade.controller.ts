import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Request, Response, NextFunction } from 'express';
import { UpgradeService } from './upgrade.service';
import { SchemaType } from '@/drizzle/schema/type';
import { HttpStatus } from '@/lib/HttpStatus';

export class UpgradeController {
  private upgradeService: UpgradeService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.upgradeService = new UpgradeService(pool);
  }
  async getAllUpgrade(req: Request, res: Response, next: NextFunction) {
    const no_pagination = req.query.no_pagination === 'true';
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.upgradeService.getAllUpgrade(
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
        data: data.upgradeDetailsWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }
  async getUpgradeById(req: Request, res: Response, next: NextFunction) {
    const { upgrade_id } = req.params;
    try {
      const data = await this.upgradeService.getUpgradeById(Number(upgrade_id));
      res.status(HttpStatus.OK.code).json({ status: 'Sucess', data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }
  async createUpgrade(req: Request, res: Response, next: NextFunction) {
    const { upgrade_id, service_id, before_specs, upgraded_components, notes } =
      req.body;
    try {
      await this.upgradeService.createUpgrade({
        upgrade_id,
        service_id,
        before_specs,
        upgraded_components,
        notes,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Upgrade Details ',
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

  async UpdateUpgrade(req: Request, res: Response, next: NextFunction) {
    const { upgrade_id } = req.params;
    const { service_id, before_specs, upgraded_components, notes } = req.body;
    try {
      await this.upgradeService.updateUpgrade(
        {
          service_id,
          before_specs,
          upgraded_components,
          notes,
        },
        Number(upgrade_id),
      );
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Upgrade Details ',
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
  async deleteUpgrade(req: Request, res: Response, next: NextFunction) {
    const { upgrade_id } = req.params;
    try {
      await this.upgradeService.deleteUpgrade(Number(upgrade_id));
      res.status(200).json({
        status: 'Success',
        message: `Service ID:${upgrade_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
