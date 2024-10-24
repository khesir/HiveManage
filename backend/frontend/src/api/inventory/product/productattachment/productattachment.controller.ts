import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { ProductAttachmentService } from './productattachment.service';

export class ProductAttachmentController {
  private productattachmentService: ProductAttachmentService;

  constructor(pool: PostgresJsDatabase) {
    this.productattachmentService = new ProductAttachmentService(pool);
  }

  async getAllProductAttachment(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.productattachmentService.getAllProductAttachment(
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
        data: data.productattachmentWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getProductAttachmentById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { product_attachment_id } = req.params;
      const data = await this.productattachmentService.getProductAttachmentById(
        Number(product_attachment_id),
      );
      res.status(200).json({ data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createProductAttachment(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { arrive_Items_id, product_id, filepath } = req.body;

      await this.productattachmentService.createProductAttachment({
        // Ensure correct method name
        arrive_Items_id,
        product_id,
        filepath,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Product Attachment',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        status: 'Error',
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async updateProductAttachment(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { product_attachment_id } = req.params;
      const { arrive_Items_id, product_id, filepath } = req.body;

      await this.productattachmentService.updateProductAttachment(
        { arrive_Items_id, product_id, filepath },
        Number(product_attachment_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Product Attachment Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteProductAttachment(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { product_attachment_id } = req.params;
      await this.productattachmentService.deleteProductAttachment(
        Number(product_attachment_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Product Attachment ID:${product_attachment_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
