import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '../../../../../lib/logger';
import { db } from '../../../../../mysql/mysql.pool';
import {
  employee,
  salaryInformation,
} from '../../../../../drizzle/drizzle.schema';
import { HttpStatus } from '../../../../../lib/HttpStatus';

export async function validateSalaryId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { salaryInfo_id } = req.params;

  try {
    const activity = await db
      .select()
      .from(salaryInformation)
      .where(
        and(
          eq(salaryInformation.salary_information_id, Number(salaryInfo_id)),
          isNull(salaryInformation.deleted_at),
        ),
      );
    if (!activity[0]) {
      return res.status(404).json({ message: 'Salary Information not found' });
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
