import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '../../../../../lib/logger';
import { db } from '../../../../../mysql/mysql.pool';
import { employee, leaveLimit } from '../../../../../drizzle/drizzle.schema';
import { HttpStatus } from '../../../../../lib/HttpStatus';

// There's a globally used
// middlewere like error handling and schema validation

export async function validateLeaveLimitID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { leaveLimit_id } = req.params;

  try {
    const activity = await db
      .select()
      .from(leaveLimit)
      .where(
        and(
          eq(leaveLimit.leave_limit_id, Number(leaveLimit_id)),
          isNull(leaveLimit.deleted_at),
        ),
      );
    console.log(activity);
    if (!activity[0]) {
      return res.status(404).json({ message: 'Leave Limit not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function validateEmployeeID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const employee_id = req.body.employee_id || req.query.employee_id;
  if (employee_id === undefined) {
    next();
  }
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