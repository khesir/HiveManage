import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '../../../../../lib/logger';
import { db } from '../../../../../mysql/mysql.pool';
import { activityLog, employee } from '../../../../../drizzle/drizzle.schema';
import { HttpStatus } from '../../../../../lib/HttpStatus';

// There's a globally used
// middlewere like error handling and schema validation

export async function validateActivtyId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { activity_id } = req.params;

  if (!activity_id) {
    return res.status(400).json({ message: 'Activity Id is required' });
  }
  try {
    const activity = await db
      .select()
      .from(activityLog)
      .where(eq(activityLog.activity_id, Number(activity_id)));
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    next();
  } catch (error) {
    console.log(error);
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
      .where(eq(employee.employee_id, Number(employee_id)));

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
