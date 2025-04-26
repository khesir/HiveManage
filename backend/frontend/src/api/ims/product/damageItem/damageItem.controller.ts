import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { HttpStatus } from '@/lib/HttpStatus';
import { SchemaType } from '@/drizzle/schema/type';
import { DamageItemService } from './damageItem.service';

export class DamageItemController {
  private damageItemservice: DamageItemService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.damageItemservice = new DamageItemService(pool);
  }

  async getAllDamageItem(req: Request, res: Response, next: NextFunction) {
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const no_pagination = req.query.no_pagination === 'true';
    const product_id = req.params.product_id as string;

    try {
      const data = await this.damageItemservice.getAllDamageItem(
        product_id,
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
        data: data.damageitemsWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getDamageItemById(req: Request, res: Response, next: NextFunction) {
    try {
      const { damage_item_id } = req.params;
      const data = await this.damageItemservice.getDamageItemById(
        Number(damage_item_id),
      );
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createDamageItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { product_id, quantity } = req.body;

      await this.damageItemservice.createDamageItem({
        product_id,
        quantity,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Damage Item ',
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

  async updateDamageItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { damage_item_id } = req.params;
      const { product_id, quantity } = req.body;

      await this.damageItemservice.updateDamageItem(
        {
          product_id,
          quantity,
        },
        Number(damage_item_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Damage Item Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteDamageItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { damage_item_id } = req.params;
      await this.damageItemservice.deleteDamageItem(Number(damage_item_id));
      res.status(200).json({
        status: 'Success',
        message: `Damage Item ID:${damage_item_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
