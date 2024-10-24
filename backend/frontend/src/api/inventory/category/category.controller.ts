import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { CategoryService } from './category.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class CategoryController {
  private categoryService: CategoryService;

  constructor(pool: PostgresJsDatabase) {
    this.categoryService = new CategoryService(pool);
  }

  async getAllCategory(req: Request, res: Response, next: NextFunction) {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.categoryService.getAllCategory(limit, offset);
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

  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { category_id } = req.params;
      const data = await this.categoryService.getCategoryById(
        Number(category_id),
      );
      res.status(200).json({ message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, content } = req.body;

      await this.categoryService.createCategory({ name, content });
      res
        .status(HttpStatus.CREATED.code)
        .json({ status: 'Success', message: 'Successfully Created Category ' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        status: 'Error ',
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { category_id } = req.params;
      const { name, content } = req.body;

      await this.categoryService.updateCategory(
        { name, content },
        Number(category_id),
      );
      res
        .status(HttpStatus.OK.code)
        .json({ status: 'Success', message: 'Category Updated Successfully ' });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { category_id } = req.params;
      await this.categoryService.deleteCategory(Number(category_id));
      res.status(200).json({
        status: 'Success',
        message: `Category ID:${category_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
