import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { HttpStatus } from '@/lib/HttpStatus';
import { SchemaType } from '@/drizzle/schema/type';
import { DamageRecordService } from './damageRecord.service';

export class DamageRecordController {
  private damageRecordservice: DamageRecordService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.damageRecordservice = new DamageRecordService(pool);
  }

  async getAllDamageRecord(req: Request, res: Response, next: NextFunction) {
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const no_pagination = req.query.no_pagination === 'true';
    const product_id = req.params.product_id as string;

    try {
      const data = await this.damageRecordservice.getAllDamageRecord(
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
        data: data.damageRecordWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getDamageRecordById(req: Request, res: Response, next: NextFunction) {
    try {
      const { damage_record_id } = req.params;
      const data = await this.damageRecordservice.getDamageRecordById(
        Number(damage_record_id),
      );
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createDamageRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const { service_record_id, product_id, damage_item_id, quantity } =
        req.body;

      await this.damageRecordservice.createDamageRecord({
        service_record_id,
        product_id,
        damage_item_id,
        quantity,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Damage Record',
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

  async updateDamageRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const { damage_record_id } = req.params;
      const { service_record_id, product_id, damage_item_id, quantity } =
        req.body;

      await this.damageRecordservice.updateDamageRecord(
        {
          service_record_id,
          product_id,
          damage_item_id,
          quantity,
        },
        Number(damage_record_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Damage Record Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteDamageRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const { damage_record_id } = req.params;
      await this.damageRecordservice.deleteDamageRecord(
        Number(damage_record_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Damage Item ID:${damage_record_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
