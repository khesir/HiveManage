import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { HttpStatus } from '@/lib/HttpStatus';
import { SerializeItemService } from './serialize.service';
import { SchemaType } from '@/drizzle/schema/type';

export class SerializeItemController {
  private serializedproductService: SerializeItemService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.serializedproductService = new SerializeItemService(pool);
  }

  async getAllSerializedProducts(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const no_pagination = req.query.no_pagination === 'true';
    const product_id = req.params.product_id as string;

    try {
      const data = await this.serializedproductService.getAllSerializedProducts(
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
        data: data.serializedproductsWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getSerializedProductById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { serialized_item_id } = req.params;
      const data =
        await this.serializedproductService.getSerializedProductsById(
          Number(serialized_item_id),
        );
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createSerializeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { product_id, serial_number, status } = req.body;

      await this.serializedproductService.createSerializeItem({
        product_id,
        serial_number,
        status,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Serialize Product ',
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

  async updateSerializeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { serialized_item_id } = req.params;
      const { product_id, serial_number, item_status } = req.body;

      await this.serializedproductService.updateSerializeItem(
        {
          product_id,
          serial_number,
          item_status,
        },
        Number(serialized_item_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Serialize Product Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteSerializeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { serialized_item_id } = req.params;
      await this.serializedproductService.deleteSerializeItem(
        Number(serialized_item_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Serialize Product ID:${serialized_item_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
