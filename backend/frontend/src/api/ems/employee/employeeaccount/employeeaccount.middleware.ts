import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { employee_account } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateEmployeeAccountID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { employee_account_id } = req.params;

  try {
    const EmployeeAccount = await db
      .select()
      .from(employee_account)
      .where(
        and(
          eq(employee_account.employee_account_id, Number(employee_account_id)),
          isNull(employee_account.deleted_at),
        ),
      );
    if (!EmployeeAccount[0]) {
      return res.status(404).json({ message: 'Employee Account not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
