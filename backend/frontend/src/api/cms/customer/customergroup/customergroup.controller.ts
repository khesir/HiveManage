import { HttpStatus } from '@/lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { SchemaType } from '@/drizzle/schema/type';
import { CustomerGroupService } from './customergroup.service';

export class CustomerGroupController {
  private customergroupService: CustomerGroupService;

  constructor(pool: PostgresJsDatabase<SchemaType>) {
    this.customergroupService = new CustomerGroupService(pool);
  }

  async getAllCustomerGroup(req: Request, res: Response, next: NextFunction) {
    const sort = (req.query.sort as string) || 'asc';
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.customergroupService.getAllCustomerGroup(
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
        data: data.result,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async getCustomerGroupById(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer_group_id } = req.params;
      const data = await this.customergroupService.getCustomerGroupById(
        Number(customer_group_id),
      );
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createCustomerGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      await this.customergroupService.createCustomerGroup({
        name,
      });
      res.status(HttpStatus.CREATED.code).json({
        status: 'Success',
        message: 'Successfully Created Customer Group ',
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

  async updateCustomerGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer_group_id } = req.params;
      const { name } = req.body;

      await this.customergroupService.updateCustomerGroup(
        {
          name,
        },
        Number(customer_group_id),
      );
      res.status(HttpStatus.OK.code).json({
        status: 'Success',
        message: 'Customer Group Updated Successfully ',
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteCustomerGroup(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer_group_id } = req.params;
      await this.customergroupService.deleteCustomerGroup(
        Number(customer_group_id),
      );
      res.status(200).json({
        status: 'Success',
        message: `Customer Group ID:${customer_group_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
