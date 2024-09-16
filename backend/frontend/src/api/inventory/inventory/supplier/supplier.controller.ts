import { Request, Response, NextFunction } from 'express';

import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { HttpStatus } from '../../../../../lib/HttpStatus';
import { SupplierService } from './supplier.service';

export class SupplierController {
  private supplierService: SupplierService;

  constructor(pool: MySql2Database) {
    this.supplierService = new SupplierService(pool);
  }

  async getAllSupplier(req: Request, res: Response, next: NextFunction) {
    const limit = Number(req.query.limit) || 10; //Default limit to 10
    const sort = (req.query.sort as string) || 'asc'; // Default sort to 'asc
    const page = Number(req.query.page) || 1;

    try {
      const Supplier = await this.supplierService.getAllSupplier({
        limit,
        sort,
        page,
      });
      res.status(200).json({ data: Supplier });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error ',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
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
      const { name, contact_number, remarks } = req.body;

      await this.supplierService.createSupplier({
        name,
        contact_number,
        remarks,
      });
      res
        .status(HttpStatus.CREATED.code)
        .json({ message: 'Successfully Created Supplier' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error ',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async updateSupplier(req: Request, res: Response, next: NextFunction) {
    try {
      const { supplier_id } = req.params;
      const { name, contact_number, remarks } = req.body;

      await this.supplierService.updateSupplier(
        { name, contact_number, remarks },
        Number(supplier_id),
      );
      res
        .status(HttpStatus.OK.code)
        .json({ message: 'Supplier Updated Successfully' });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteSupplierById(req: Request, res: Response, next: NextFunction) {
    try {
      const { supplier_id } = req.params;
      await this.supplierService.deleteSupplier(Number(supplier_id));
      res.status(200).json({
        message: `Supplier ID:${supplier_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }
}
