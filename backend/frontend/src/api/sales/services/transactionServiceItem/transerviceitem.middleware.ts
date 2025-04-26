import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { HttpStatus } from '@/lib/HttpStatus';
import { employee } from '@/drizzle/schema/ems';
import { transactionServiceItems } from '@/drizzle/schema/services/schema/service/transactionServiceItems.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateTranServiceItemsID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { transaction_service_id } = req.params;

  try {
    const TransasctionServiceItem = await db
      .select()
      .from(transactionServiceItems)
      .where(
        and(
          eq(
            transactionServiceItems.transaction_service_item_id,
            Number(transaction_service_id),
          ),
          isNull(transactionServiceItems.deleted_at),
        ),
      );
    if (!TransasctionServiceItem[0]) {
      return res
        .status(404)
        .json({ message: 'Transaction Service Item not found' });
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
