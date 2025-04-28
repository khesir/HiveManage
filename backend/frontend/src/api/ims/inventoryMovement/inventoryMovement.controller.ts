import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { HttpStatus } from '@/lib/HttpStatus';
import { SchemaType } from '@/drizzle/schema/type';
import { InventoryMovementService } from './inventoryMovement.service';

export class InventoryMovementController {
  private inventoryMovementservice: InventoryMovementService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.inventoryMovementservice = new InventoryMovementService(pool);
  }

  async getAllInventoryMovement(
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
      const data = await this.inventoryMovementservice.getAllInventoryMovement(
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
        data: data.inventoryMovementWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getInventoryMovementById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { inventory_movement_id } = req.params;
      const data = await this.inventoryMovementservice.getInventoryMovementById(
        Number(inventory_movement_id),
      );
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createInventoryMovement(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const {
        product_id,
        source_type,
        destination_type,
        quantity,
        serial_ids,
        reason,
      } = req.body;

      await this.inventoryMovementservice.createInventoryMovement({
        product_id,
        source_type,
        destination_type,
        quantity,
        serial_ids,
        reason,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Inventory Movement',
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

  async updateInventoryMovement(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { inventory_movement_id } = req.params;
      const {
        product_id,
        source_type,
        destination_type,
        quantity,
        serial_ids,
        reason,
      } = req.body;

      await this.inventoryMovementservice.updateInventoryMovement(
        {
          product_id,
          source_type,
          destination_type,
          quantity,
          serial_ids,
          reason,
        },
        Number(inventory_movement_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Inventory Movement Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteInventoryMovement(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { inventory_movement_id } = req.params;
      await this.inventoryMovementservice.deleteInventoryMovement(
        Number(inventory_movement_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Inventory Movement ID:${inventory_movement_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
