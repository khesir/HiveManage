import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { HttpStatus } from '@/lib/HttpStatus';
import { employee } from '@/drizzle/schema/ems';
import { cleaningDetails } from '@/drizzle/schema/services/schema/service/services/cleaningDetails.schema';

export async function validateCleaningID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { cleaning_id } = req.params;

  try {
    const cleaningData = await db
      .select()
      .from(cleaningDetails)
      .where(
        and(
          eq(cleaningDetails.cleaning_id, Number(cleaning_id)),
          isNull(cleaningDetails.deleted_at),
        ),
      );
    if (!cleaningData[0]) {
      return res.status(404).json({ message: 'cleaning not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}

export async function validateSalesByEmployeeID(
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
