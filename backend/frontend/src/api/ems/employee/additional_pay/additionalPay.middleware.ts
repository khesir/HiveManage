import { eq, and } from 'drizzle-orm';
import { NextFunction, Response, Request } from 'express';

import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { HttpStatus } from '@/lib/config';
import { additionalPay, employee } from '@/drizzle/drizzle.schema';

export async function validateAdditionalPayId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { additional_pay_id } = req.params;

  try {
    const additionalpay = await db
      .select()
      .from(additionalPay)
      .where(
        and(eq(additionalPay.additional_pay_id, Number(additional_pay_id))),
      );
    console.log(additionalPay);
    if (!additionalpay[0]) {
      return res.status(404).json({ message: 'Additional Pay not found ' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}

export async function validateAdditionalPayByEmployeeId(
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
      .json({ message: 'Internal Server Error ' });
  }
}
