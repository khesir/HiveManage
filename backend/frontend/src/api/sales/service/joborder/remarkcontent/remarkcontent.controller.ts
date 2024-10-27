import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/drizzle.schema';
import { RemarkContentService } from './remarkcontent.service';

export class RemarkContentController {
  private remarkcontentService: RemarkContentService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.remarkcontentService = new RemarkContentService(pool);
  }

  async getAllRemarkContent(req: Request, res: Response, next: NextFunction) {
    const limit = parseInt(req.query.limit as string) || 10; // default limit value
    const offset = parseInt(req.query.offset as string) || 0; // default offset value
    try {
      // Fetch data count from the database
      const data = await this.remarkcontentService.getAllRemarkContent(
        limit,
        offset,
      );
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

  async getRemarkContentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { remarkcontent_id } = req.params;
      const data = await this.remarkcontentService.getRemarkContentById(
        Number(remarkcontent_id),
      );
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createRemarkContent(req: Request, res: Response, next: NextFunction) {
    try {
      const { markdown } = req.body;

      await this.remarkcontentService.createRemarkContent({
        markdown,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Remark Content ',
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

  async updateRemarkContent(req: Request, res: Response, next: NextFunction) {
    try {
      const { remarkcontent_id } = req.params;
      const { markdown } = req.body;

      await this.remarkcontentService.updateRemarkContent(
        { markdown },
        Number(remarkcontent_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Remark Content Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteRemarkContent(req: Request, res: Response, next: NextFunction) {
    try {
      const { remarkcontent_id } = req.params;
      await this.remarkcontentService.deleteRemarkContent(
        Number(remarkcontent_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Remark Content ID:${remarkcontent_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
