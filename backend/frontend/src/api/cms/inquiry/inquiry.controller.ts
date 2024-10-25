import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { InquiryService } from './inquiry.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/drizzle.schema';

export class InquiryController {
  private inquiryService: InquiryService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.inquiryService = new InquiryService(pool);
  }

  async getAllInquiry(req: Request, res: Response, next: NextFunction) {
    const id = (req.query.id as string) || undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.inquiryService.getAllInquiry(id, limit, offset);
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
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

  async getInquiryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { inquiry_id } = req.params;
      const data = await this.inquiryService.getInquiryById(Number(inquiry_id));
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createInquiry(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer_id, inquiryTitle, inquiry_type } = req.body;

      await this.inquiryService.createInquiry({
        customer_id,
        inquiryTitle,
        inquiry_type,
      });
      res
        .status(HttpStatus.CREATED.code)
        .json({ status: 'Success', message: 'Successfully Created Customer ' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        status: 'Error ',
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async updateInquiry(req: Request, res: Response, next: NextFunction) {
    try {
      const { inquiry_id } = req.params;
      const { customer_id, inquiryTitle, inquiry_type } = req.body;

      await this.inquiryService.updateInquiry(
        {
          customer_id,
          inquiryTitle,
          inquiry_type,
        },
        Number(inquiry_id),
      );
      res
        .status(HttpStatus.OK.code)
        .json({ status: 'Success', message: 'Inquiry Updated Successfully ' });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteInquiry(req: Request, res: Response, next: NextFunction) {
    try {
      const { inquiry_id } = req.params;
      await this.inquiryService.deleteInquiry(Number(inquiry_id));
      res.status(200).json({
        status: 'Success',
        message: `Inquiry ID:${inquiry_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
