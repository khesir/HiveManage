import { Request, Response, NextFunction } from 'express';

import { HttpStatus } from '@/lib/config';
import { DesignationService } from './designation.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { SchemaType } from '@/drizzle/drizzle.schema';

export class DesignationController {
  private designationService: DesignationService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.designationService = new DesignationService(pool);
  }

  async getAllDesignation(req: Request, res: Response, next: NextFunction) {
    const status = (req.query.status as string) || undefined;
    try {
      const data = await this.designationService.getAllDesignations(status);
      res.status(HttpStatus.OK.code).json({ data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error' });
      next(error);
    }
  }

  async getDesignationById(req: Request, res: Response, next: NextFunction) {
    try {
      const { designation_id } = req.params;
      const data = await this.designationService.getDesignationById(
        Number(designation_id),
      );

      res.status(HttpStatus.OK.code).send({ data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send({ message: 'Internal Server Error' });
      next(error);
    }
  }

  async createDesignation(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, status } = req.body;
      await this.designationService.createDesignation({
        name,
        status,
      });
      res.status(HttpStatus.CREATED.code).json({
        message: 'Designation Created successfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
  async updateDesignation(req: Request, res: Response, next: NextFunction) {
    try {
      const { designation_id } = req.params;
      const { title, status } = req.body;
      await this.designationService.updateDesignation(
        { title, status },
        Number(designation_id),
      );
      res.status(HttpStatus.OK.code).json({
        message: 'Designation Updated succesfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
  async deleteDesignationById(req: Request, res: Response, next: NextFunction) {
    try {
      const { designation_id } = req.params;
      await this.designationService.deleteDesignation(Number(designation_id));
      res.status(200).json({
        message: `Designation ID: ${designation_id} deleted successfully`,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
}
