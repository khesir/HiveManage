import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { HttpStatus } from '@/lib/HttpStatus';
import { db } from '@/drizzle/pool';
import { employmentInformation, employee } from '@/drizzle/schema/ems';

export async function validateEmploymentId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { employment_id } = req.params;

  try {
    const activity = await db
      .select()
      .from(employmentInformation)
      .where(
        and(
          eq(employmentInformation.employment_info_id, Number(employment_id)),
          isNull(employmentInformation.deleted_at),
        ),
      );
    if (!activity[0]) {
      return res
        .status(404)
        .json({ message: 'Employment Information not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function validateEmployeeId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { employee_id } = req.params;

  try {
    if (employee_id === undefined) {
      next();
    } else {
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
    }
  } catch (error) {
    console.log(error);
    log.error(error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .json({ message: 'Internal server error' });
  }
}
