import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { HttpStatus } from '../../../../lib/HttpStatus';
import { Request, Response, NextFunction } from 'express';
import { CustomerService } from './customer.service';

export class CustomerController {
  private customerService: CustomerService;

  constructor(pool: MySql2Database) {
    this.customerService = new CustomerService(pool);
  }

  async getAllCustomer(req: Request, res: Response, next: NextFunction) {
    const id = (req.query.id as string) || undefined;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    try {
      const data = await this.customerService.getAllCustomer(id, limit, offset);
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

  async getCustomerById(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer_id } = req.params;
      const data = await this.customerService.getCustomerById(
        Number(customer_id),
      );
      res.status(200).json({ status: 'Success', message: data });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error ' });
      next(error);
    }
  }

  async createCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        firstname,
        lastname,
        contact_phone,
        socials,
        address_line,
        barangay,
        province,
        standing,
      } = req.body;

      await this.customerService.createCustomer({
        firstname,
        lastname,
        contact_phone,
        socials,
        address_line,
        barangay,
        province,
        standing,
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

  async updateCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer_id } = req.params;
      const {
        firstname,
        lastname,
        contact_phone,
        socials,
        address_line,
        barangay,
        province,
        standing,
      } = req.body;

      await this.customerService.updateCustomer(
        {
          firstname,
          lastname,
          contact_phone,
          socials,
          address_line,
          barangay,
          province,
          standing,
        },
        Number(customer_id),
      );
      res
        .status(HttpStatus.OK.code)
        .json({ status: 'Success', message: 'Customer Updated Successfully ' });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error ' });
      next(error);
    }
  }

  async deleteCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const { customer_id } = req.params;
      await this.customerService.deleteCustomer(Number(customer_id));
      res.status(200).json({
        status: 'Success',
        message: `Customer ID:${customer_id} is deleted Successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ status: 'Error', message: 'Internal Server Error' });
      next(error);
    }
  }
}
