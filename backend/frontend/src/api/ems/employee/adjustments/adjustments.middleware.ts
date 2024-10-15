import { eq, and } from 'drizzle-orm';
import { NextFunction, Response, Request } from 'express';

import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { HttpStatus } from '@/lib/config';
import { adjustments, employee } from '@/drizzle/drizzle.schema';

export async function validateAdjustmentsId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { adjustments_id } = req.params;

  try {
    const Adjustments = await db
      .select()
      .from(adjustments)
      .where(and(eq(adjustments.adjustments_id, Number(adjustments_id))));
    console.log(Adjustments);
    if (!Adjustments[0]) {
      return res.status(404).json({ message: 'Adjustment not found ' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}

export async function validateAdjustmentsByEmployeeId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { employee_id } = req.params;

  try {
    const data = await db
      .select()
      .from(employee)
      .where(and(eq(employee.employee_id, Number(employee_id))));

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
      .json({ message: 'Internal Server Error ' });
  }
}
