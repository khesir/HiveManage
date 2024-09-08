import { Request, Response, NextFunction } from 'express';

import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { HttpStatus } from '../../../../../lib/config';
import { PayrollReportsService } from './payroll_reports.service';

export class PayrollReportsController {
  private payrollReportsService: PayrollReportsService;

  constructor(pool: MySql2Database) {
    this.payrollReportsService = new PayrollReportsService(pool);
  }

  async updatePayrollReports(req: Request, res: Response, next: NextFunction) {
    try {
      const { payroll_report } = req.params;
      const {
        on_payroll_id,
        netpay,
        grosspay,
        total_deductions,
        total_benefits,
      } = req.body;

      await this.payrollReportsService.updatePayrollReports(
        {
          on_payroll_id,
          netpay,
          grosspay,
          total_deductions,
          total_benefits,
        },
        Number(payroll_report),
      );
      res
        .status(HttpStatus.OK.code)
        .json({ message: 'Payroll Report Updated ' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
}
