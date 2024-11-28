import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';
import { SchemaType } from '@/drizzle/drizzle.schema';
import { ProductVarSupplierService } from './prodvarsupp.service';

export class ProductVariantSupplierController {
  private productvariantsuppService: ProductVarSupplierService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.productvariantsuppService = new ProductVarSupplierService(pool);
  }

  async getAllProductVariantSupplier(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const product_id = parseInt(req.params.product_id as string) || undefined;
    try {
      const data =
        await this.productvariantsuppService.getAllProductVarSupplier(
          sort,
          limit,
          offset,
          product_id,
        );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Data Retrieved Successfully',
        total_data: data.totalData,
        limit: limit,
        offset: offset,
        data: data.productvariantSupplierWithDetails,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getProductVariantSupplierById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { prdvariantsupp_id } = req.params;
      const data =
        await this.productvariantsuppService.getProductVarSupplierById(
          Number(prdvariantsupp_id),
        );
      res.status(200).json({ data: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createProductVariantSupplier(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const {
        variant_id,
        supplier_id,
        supply_price,
        minimum_order_quantity,
        lead_time_days,
      } = req.body;

      await this.productvariantsuppService.createProductVarSupplier({
        // Ensure correct method name
        variant_id,
        supplier_id,
        supply_price,
        minimum_order_quantity,
        lead_time_days,
      });

      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Product Variant Supplier',
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

  async updateProductVariantSupplier(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { prdvariantsupp_id } = req.params;
      const {
        variant_id,
        supplier_id,
        supply_price,
        minimum_order_quantity,
        lead_time_days,
      } = req.body;

      await this.productvariantsuppService.updateProductVarSupplier(
        {
          variant_id,
          supplier_id,
          supply_price,
          minimum_order_quantity,
          lead_time_days,
        },
        Number(prdvariantsupp_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Product Variant Supplier Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteProductVariantSupplier(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { prdvariantsupp_id } = req.params;
      await this.productvariantsuppService.deleteProductVarSupplier(
        Number(prdvariantsupp_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Product Variant Supplier ID:${prdvariantsupp_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
