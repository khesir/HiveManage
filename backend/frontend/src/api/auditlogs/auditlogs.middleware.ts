import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { auditLog, employee } from '@/drizzle/drizzle.schema';
import { HttpStatus } from '@/lib/HttpStatus';
import { db } from '@/drizzle/pool';

// There's a globally used
// middlewere like error handling and schema validation

export async function validateAuditID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { auditlog_id } = req.params;
  try {
    const audit = await db
      .select()
      .from(auditLog)
      .where(
        and(
          eq(auditLog.auditlog_id, Number(auditlog_id)),
          isNull(auditLog.deleted_at),
        ),
      );
    if (!audit[0]) {
      return res.status(404).json({ message: 'Audit Log not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function validateActivityEmployeeID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { employee_id } = req.body;

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
        .json({ message: 'Employee not found' });
    }
    next();
  } catch (error) {
    console.log(error);
    log.error(error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .json({ message: 'Internal server error' });
  }
}
