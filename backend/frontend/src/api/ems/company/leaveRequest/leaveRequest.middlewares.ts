import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '../../../../../lib/logger';
import { db } from '../../../../../mysql/mysql.pool';
import { employee, leaveRequest } from '../../../../../drizzle/drizzle.schema';
import { HttpStatus } from '../../../../../lib/HttpStatus';

// There's a globally used
// middlewere like error handling and schema validation

export async function validateLeaveRequestID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { leaveRequest_id } = req.params;

  try {
    const data = await db
      .select()
      .from(leaveRequest)
      .where(
        and(
          eq(leaveRequest.leave_request_id, Number(leaveRequest_id)),
          isNull(leaveRequest.deleted_at),
        ),
      );
    if (!data[0]) {
      return res.status(404).json({ message: 'Leave Request not found' });
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

  try {
    if (employee_id && !isNaN(employee_id)) {
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
    } else {
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
