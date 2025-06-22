import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '@/lib/HttpStatus';
import { SupplierService } from './supplier.service';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';

export class SupplierController {
  private supplierService: SupplierService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.supplierService = new SupplierService(pool);
  }

  async getAllSupplier(req: Request, res: Response, next: NextFunction) {
    const relationship = (req.query.relationship as string) || undefined;
    try {
      const suppliers = await this.supplierService.getAllSupplier(relationship);
      res.status(HttpStatus.OK.code).json({ data: suppliers });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }

  async getSupplierById(req: Request, res: Response, next: NextFunction) {
    try {
      const { supplier_id } = req.params;
      const data = await this.supplierService.getSupplierById(
        Number(supplier_id),
      );
      res.status(200).json({ message: data });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error ',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async createSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, contact_number, remarks, relationship, user, status } =
        req.body;

      await this.supplierService.createSupplier(
        {
          name,
          contact_number,
          remarks,
          relationship,
          user,
          status,
        },
        req.file,
      );
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Supplier ',
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

  async updateSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const { supplier_id } = req.params;
      const { name, contact_number, remarks, relationship, user, status } =
        req.body;

      await this.supplierService.updateSupplier(
        {
          name,
          contact_number,
          remarks,
          relationship,
          user,
          status,
        },
        Number(supplier_id),
        req.file,
      );
      res
        .status(HttpStatus.OK.code)
        .json({ status: 'Success', message: 'Supplier Updated Successfully' });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteSupplierById(req: Request, res: Response, next: NextFunction) {
    try {
      const { supplier_id } = req.params;
      const user = req.query.user as string | undefined;
      await this.supplierService.deleteSupplier(
        Number(supplier_id),
        Number(user),
      );
      res.status(200).json({
        status: 'Success',
        message: `Supplier ID:${supplier_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }
}
