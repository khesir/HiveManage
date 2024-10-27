import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { employee, remarktype } from '@/drizzle/drizzle.schema';
import { HttpStatus } from '@/lib/HttpStatus';

// There's a globally used
// middleware like error handling and schema validation

export async function validateRemarkTypeID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { remark_type_id } = req.params;

  try {
    const RemarkType = await db
      .select()
      .from(remarktype)
      .where(
        and(
          eq(remarktype.remark_type_id, Number(remark_type_id)),
          isNull(remarktype.deleted_at),
        ),
      );
    console.log(RemarkType);
    if (!RemarkType[0]) {
      return res.status(404).json({ message: 'Remark Type not found' });
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
