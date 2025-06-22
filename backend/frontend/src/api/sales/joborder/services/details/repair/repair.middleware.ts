import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { HttpStatus } from '@/lib/HttpStatus';
import { employee } from '@/drizzle/schema/ems';
import { repairDetails } from '@/drizzle/schema/services/schema/service/services/repairDetails.schema';

export async function validateRepairID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { repair_id } = req.params;

  try {
    const repairData = await db
      .select()
      .from(repairDetails)
      .where(
        and(
          eq(repairDetails.repair_details_id, Number(repair_id)),
          isNull(repairDetails.deleted_at),
        ),
      );
    if (!repairData[0]) {
      return res.status(404).json({ message: 'Repair not found' });
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
