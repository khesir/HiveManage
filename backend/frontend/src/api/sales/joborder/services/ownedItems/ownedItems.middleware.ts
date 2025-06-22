import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { HttpStatus } from '@/lib/HttpStatus';
import { employee } from '@/drizzle/schema/ems';
import { serviceOwnedItems } from '@/drizzle/schema/services/schema/service/serviceOwnedItems.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateOwnedServiceItemsID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { service_owned_id } = req.params;

  try {
    const serviceOwnedItemsData = await db
      .select()
      .from(serviceOwnedItems)
      .where(
        and(
          eq(serviceOwnedItems.service_owned_id, Number(service_owned_id)),
          isNull(serviceOwnedItems.deleted_at),
        ),
      );
    if (!serviceOwnedItemsData[0]) {
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
