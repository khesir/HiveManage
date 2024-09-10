import { NextFunction, Request, Response } from 'express';
import { eq, and } from 'drizzle-orm';

import { db } from '../../../../../mysql/mysql.pool';
import log from '../../../../../lib/logger';
import { onPayroll } from '../../../../../drizzle/drizzle.schema';

export async function captureQuery(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { payroll_id } = req.query;

  try {
    const data = await db
      .select()
      .from(onPayroll)
      .where(and(eq(onPayroll.payroll_id, Number(payroll_id))));
    if (!data[0]) {
      return res.status(404).json({ message: `Payroll not found` });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
