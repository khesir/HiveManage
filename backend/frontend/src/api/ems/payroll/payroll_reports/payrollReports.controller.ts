import { Request, Response, NextFunction } from 'express';

import { MySql2Database } from 'drizzle-orm/mysql2/driver';
import { HttpStatus } from '@/lib/config';
import { PayrollReportsService } from './payrollReports.service';

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

  async createPayrollReports(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        on_payroll_id,
        netpay,
        grosspay,
        total_deductions,
        total_benefits,
      } = req.body;

      await this.payrollReportsService.createPayrollReports({
        on_payroll_id,
        netpay,
        grosspay,
        total_deductions,
        total_benefits,
      });
      res
        .status(HttpStatus.CREATED.code)
        .json({ message: 'Payroll Reports Created' });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR.code,
      });
      next(error);
    }
  }

  async getAllPayrollReports(req: Request, res: Response, next: NextFunction) {
    const on_payroll_id = req.query.id
      ? parseInt(req.query.on_payroll_id as string, 10)
      : undefined; // Extracting and Parsing id

    try {
      const payrollReports =
        await this.payrollReportsService.getAllPayrollReports(on_payroll_id); // Passing id to the service
      res.status(HttpStatus.OK.code).json({ data: payrollReports });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error' });
      next(error);
    }
  }

  async getAllPayrollReportsById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { payroll_report } = req.params;
      console.log(payroll_report);
      const data = await this.payrollReportsService.getPayrollReportsById(
        Number(payroll_report),
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

  async getAllPayrollReportByOnPayrollId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { on_payroll_id } = req.params;
      const data =
        await this.payrollReportsService.getPayrollReportsByOnPayrollId(
          Number(on_payroll_id),
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

  async deletePayrollReportsById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { payroll_report } = req.params;
      await this.payrollReportsService.deletePayrollReports(
        Number(payroll_report),
      );
      res.status(200).json({
        message: `Payroll ID:${payroll_report} is deleted successfully`,
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal Server Error' });
      next(error);
    }
  }
}
