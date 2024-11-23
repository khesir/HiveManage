import { Request, Response, NextFunction } from 'express';
import { SchemaType } from '@/drizzle/drizzle.schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SerializeItemService } from './serializeitem.service';
import { HttpStatus } from '@/lib/HttpStatus';

export class SerializeItemController {
  private serializeItemService: SerializeItemService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.serializeItemService = new SerializeItemService(pool);
  }

  async getAllSerializeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await this.serializeItemService.getAllSerializeItem();

      res.status(HttpStatus.OK.code).json({
        status: 'Sucess',
        data: data,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }
}
