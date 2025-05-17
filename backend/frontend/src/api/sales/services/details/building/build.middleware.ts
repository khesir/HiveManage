import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { HttpStatus } from '@/lib/HttpStatus';
import { employee } from '@/drizzle/schema/ems';
import { buildDetails } from '@/drizzle/schema/services/schema/service/services/buildDetails.schema';

export async function validateBuildID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { build_id } = req.params;

  try {
    const buildData = await db
      .select()
      .from(buildDetails)
      .where(
        and(
          eq(buildDetails.build_id, Number(build_id)),
          isNull(buildDetails.deleted_at),
        ),
      );
    if (!buildData[0]) {
      return res.status(404).json({ message: 'build not found' });
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
