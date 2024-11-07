import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { employee_roles } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateEmployeeAccountID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { employee_id } = req.params;

  try {
    const EmployeeAccount = await db
      .select()
      .from(employee_roles)
      .where(
        and(
          eq(employee_roles.employee_id, Number(employee_id)),
          isNull(employee_roles.deleted_at),
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
