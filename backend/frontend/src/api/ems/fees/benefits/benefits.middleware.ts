import { eq, and } from 'drizzle-orm';
import { NextFunction, Response, Request } from 'express';

import { db } from 'mysql/mysql.pool';
import log from 'lib/logger';
import { benefits, employee } from 'drizzle/drizzle.schema';
import { HttpStatus } from 'lib/config';

export async function validateBenefitId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { benefits_id } = req.params;

  try {
    const beneFits = await db
      .select()
      .from(benefits)
      .where(and(eq(benefits.benefits_id, Number(benefits_id))));
    console.log(beneFits);
    if (!beneFits[0]) {
      return res.status(404).json({ message: 'Benefit not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal server error ' });
  }
}

export async function validateBenefitByEmployeeId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { employee_id } = req.body;

  try {
    const data = await db
      .select()
      .from(employee)
      .where(and(eq(employee.employee_id, Number(employee_id))));
    console.log(data);
    if (!data[0]) {
      return res
        .status(HttpStatus.NOT_FOUND.code)
        .json({ message: 'Employee not found ' });
    }
    next();
  } catch (error) {
    console.log(error);
    log.error(error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .json({ message: 'Internal server error ' });
  }
}
