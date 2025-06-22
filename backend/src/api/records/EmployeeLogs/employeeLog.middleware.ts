import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { employeeLog } from '@/drizzle/schema/records/schema/employeeLog';

// There's a globally used
// middleware like error handling and schema validation

export async function validateEmployeeLogID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { employee_logs_id } = req.params;

  try {
    const data = await db
      .select()
      .from(employeeLog)
      .where(
        and(
          eq(employeeLog.employee_logs_id, Number(employee_logs_id)),
          isNull(employeeLog.deleted_at),
        ),
      );

    if (!data[0]) {
      return res.status(404).json({ message: 'Employee Log not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
