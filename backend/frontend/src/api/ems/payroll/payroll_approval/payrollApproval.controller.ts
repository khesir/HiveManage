import { Request, Response, NextFunction } from 'express';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js/driver';

import { HttpStatus } from '@/lib/config';
import { PayrollApprovalService } from './payrollApproval.service';

export class PayrollApprovalController {
  private payrollApprovalService: PayrollApprovalService;

  constructor(pool: PostgresJsDatabase) {
    this.payrollApprovalService = new PayrollApprovalService(pool);
  }

  async createPayrollApproval(req: Request, res: Response, next: NextFunction) {
    try {
      const { on_payroll_id, signatory_id, approval_status, approval_date } =
        req.body;
      await this.payrollApprovalService.createPayrollApproval({
        on_payroll_id,
        signatory_id,
        approval_status,
        approval_date,
      });
      res.status(HttpStatus.OK.code).json({
        message: 'Payroll Approval Created succesfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }

  async getPayrollApprovalById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { payroll_approval_id } = req.params;
      const { on_payroll_id } = req.query;
      const result = await this.payrollApprovalService.getPayrollApprovalbyId(
        Number(payroll_approval_id),
        Number(on_payroll_id),
      );
      res.status(HttpStatus.OK.code).json({ data: result });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send({ message: 'Internal Server Error' });
      next(error);
    }
  }

  async getAllPayrollApprovals(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const on_payroll_id = Number(req.query.employee_id) || undefined;
    try {
      const payrollApprovals =
        await this.payrollApprovalService.getAllPayrollApprovals(on_payroll_id);
      res.status(HttpStatus.OK.code).json({ data: payrollApprovals });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }

  async updatePayrollApproval(req: Request, res: Response, next: NextFunction) {
    try {
      const { payroll_approval_id } = req.params;
      const { on_payroll_id, signatory_id, approval_status, approval_date } =
        req.body;
      await this.payrollApprovalService.updatePayrollApproval(
        {
          on_payroll_id,
          signatory_id,
          approval_status,
          approval_date,
        },
        Number(payroll_approval_id),
      );
      res.status(HttpStatus.OK.code).json({
        message: 'Payroll Approval Updated succesfully',
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }

  async deletePayrollApproval(req: Request, res: Response, next: NextFunction) {
    try {
      const { payroll_approval_id } = req.params;
      await this.payrollApprovalService.deletePayrollApproval(
        Number(payroll_approval_id),
      );
      res
        .status(HttpStatus.OK.code)
        .json({ message: 'Payroll Approval deleted succesfully' });
    } catch (error) {
      res.status(HttpStatus.OK.code).json({
        message: 'Internal Server Error',
      });
      next(error);
    }
  }
}
