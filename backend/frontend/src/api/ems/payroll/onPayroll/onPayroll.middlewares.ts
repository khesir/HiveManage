import { NextFunction, Request, Response } from 'express';
import { eq, and } from 'drizzle-orm';

import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { payroll } from '@/drizzle/drizzle.schema';

export async function validatePayrollId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { payroll_id } = req.params;

  try {
    const data = await db
      .select()
      .from(payroll)
      .where(and(eq(payroll.payroll_id, Number(payroll_id))));
    if (!data[0]) {
      return res.status(404).json({ message: `Payroll Not found` });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
