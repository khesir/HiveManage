import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '../../../../../lib/logger';
import { db } from '../../../../../mysql/mysql.pool';
import { payrollApproval, signatory, onPayroll } from '../../../../../drizzle/drizzle.schema';
import { HttpStatus } from '../../../../../lib/HttpStatus';

export async function validatePayrollApprovalId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { payroll_approval_id } = req.params;

  try {
    const activity = await db
      .select()
      .from(payrollApproval)
      .where(
        and(
          eq(payrollApproval.payroll_approval_id, Number(payroll_approval_id)),
          isNull(payrollApproval.deleted_at),
        ),
      );
    if (!activity[0]) {
      return res.status(404).json({ message: 'Payroll Approval not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function validateSignatoryId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const signatory_id = req.body.signatory_id || req.query.signatory_id;

  try {
    if (signatory_id === undefined) {
      next();
    } else {
      const data = await db
        .select()
        .from(signatory)
        .where(
          and(
            eq(signatory.signatory_id, Number(signatory_id)),
            isNull(signatory.deleted_at),
          ),
        );
      if (!data[0]) {
        return res
          .status(HttpStatus.NOT_FOUND.code)
          .json({ message: 'Signatory not found' });
      }
      next();
    }
  } catch (error) {
    console.log(error);
    log.error(error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .json({ message: 'Internal server error' });
  }
}

export async function validateOnPayrollId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const on_payroll_id = req.body.on_payroll_id || req.query.on_payroll_id;
  
    try {
      if (on_payroll_id === undefined) {
        next();
      } else {
        const data = await db
          .select()
          .from(onPayroll)
          .where(
            and(
              eq(onPayroll.on_payroll_id, Number(on_payroll_id)),
              isNull(onPayroll.deleted_at),
            ),
          );
        if (!data[0]) {
          return res
            .status(HttpStatus.NOT_FOUND.code)
            .json({ message: 'On Payroll not found' });
        }
        next();
      }
    } catch (error) {
      console.log(error);
      log.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .json({ message: 'Internal server error' });
    }
  }