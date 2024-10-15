import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Response, Request } from 'express';

import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { HttpStatus } from '@/lib/config';
import { deductions, employee } from '@/drizzle/drizzle.schema';

export async function validateDeductionsId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { deduction_id } = req.params;

  try {
    const deducTions = await db
      .select()
      .from(deductions)
      .where(
        and(
          eq(deductions.deduction_id, Number(deduction_id)),
          isNull(deductions.deleted_at),
        ),
      );
    console.log(deducTions);
    if (!deducTions[0]) {
      return res.status(404).json({ message: 'Deduction not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal server error ' });
  }
}

export async function validateDeductionsByEmployeeId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { employee_id } = req.params;

  try {
    const data = await db
      .select()
      .from(employee)
      .where(
        and(
          eq(employee.employee_id, Number(employee_id)),
          isNull(employee.deleted_at),
        ),
      );
    console.log(data);
    if (!data[0]) {
      return res
        .status(HttpStatus.NOT_FOUND.code)
        .json({ message: 'Employee not found ' });
    }
    next();
  } catch (error) {
    console.log(error);
    log.error(error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .json({ message: 'Internal server error ' });
  }
}
