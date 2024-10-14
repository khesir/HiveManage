import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';

import { HttpStatus } from '@/lib/config';
import { FinancialInformationService } from './financialInformation.service';

export class FinancialInformationController {
  private financialInformationService: FinancialInformationService;

  constructor(pool: PostgresJsDatabase) {
    this.financialInformationService = new FinancialInformationService(pool);
  }

  async getFinancialInformation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { financial_id } = req.params;
      const { employee_id } = req.params;
      const result =
        await this.financialInformationService.getFinancialInformation(
          Number(financial_id),
          Number(employee_id),
        );

      res.status(HttpStatus.OK.code).json({ data: result });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send({ message: 'Internal Server Error' });
      next(error);
    }
  }
  async createFinancialInformation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { employee_id } = req.params;
      const { pag_ibig_id, sss_id, philhealth_id, tin, bank_account_number } =
        req.body;
      await this.financialInformationService.createFinancialInformation({
        employee_id,
        pag_ibig_id,
        sss_id,
        philhealth_id,
        tin,
        bank_account_number,
      });
      res.status(HttpStatus.OK.code).json({
        message: 'Financial Information Created succesfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
  async updateFinancialInformation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { financial_id, employee_id } = req.params;
      const { pag_ibig_id, sss_id, philhealth_id, tin, bank_account_number } =
        req.body;
      await this.financialInformationService.updateFinancialInformation(
        {
          employee_id,
          pag_ibig_id,
          sss_id,
          philhealth_id,
          tin,
          bank_account_number,
        },
        Number(financial_id),
      );
      res.status(HttpStatus.OK.code).json({
        message: 'Financial Information Updated succesfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
  async deleteEmploymentInformation(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { financial_id } = req.params;
      await this.financialInformationService.deleteFinancialInformation(
        Number(financial_id),
      );
      res
        .status(HttpStatus.OK.code)
        .json({ message: 'Employment Information deleted succesfully' });
    } catch (error) {
      res.status(HttpStatus.OK.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
}
