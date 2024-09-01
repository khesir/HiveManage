import { Request, Response as ExpressResponse } from 'express';
import { Pool } from 'mysql2/promise';

import { SupplierModel } from './supplier.model';
import Response from '../../../../lib/response';
import { HttpStatus } from '../../../../config/config';

export class SupplierController {
  private supplierModel: SupplierModel;

  constructor(pool: Pool) {
    this.supplierModel = new SupplierModel(pool);
  }

  async getAllSupplier(req: Request, res: ExpressResponse): Promise<void> {
    try {
      const supplier = await this.supplierModel.getAllSupplier();
      const response = new Response(
        HttpStatus.OK.code,
        HttpStatus.OK.status,
        'Supplier retrieved successfully',
        supplier,
      );
      res.status(HttpStatus.OK.code).send(response);
    } catch {
      const response = new Response(
        HttpStatus.INTERNAL_SERVER_ERROR.code,
        HttpStatus.INTERNAL_SERVER_ERROR.status,
        'Failed to retrieve supplier',
        null,
      );
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(response);
    }
  }

  async getSupplierById(req: Request, res: ExpressResponse): Promise<void> {
    try {
      const { supplierId } = req.params;
      const supplier = await this.supplierModel.getSupplierById(
        Number(supplierId),
      );
      if (supplier) {
        const response = new Response(
          HttpStatus.OK.code,
          HttpStatus.OK.status,
          'Supplier retrieved successfully',
          supplier,
        );
        res.status(HttpStatus.OK.code).send(response);
      } else {
        const response = new Response(
          HttpStatus.NOT_FOUND.code,
          HttpStatus.NOT_FOUND.status,
          'Supplier not found',
          null,
        );
        res.status(HttpStatus.NOT_FOUND.code).send(response);
      }
    } catch {
      const response = new Response(
        HttpStatus.INTERNAL_SERVER_ERROR.code,
        HttpStatus.INTERNAL_SERVER_ERROR.status,
        'Failed to retrieved Supplier',
        null,
      );
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(response);
    }
  }
}
