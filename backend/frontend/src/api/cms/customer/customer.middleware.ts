import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { customer } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateCustomerID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { customer_id } = req.params;

  try {
    const Customer = await db
      .select()
      .from(customer)
      .where(
        and(
          eq(customer.customer_id, Number(customer_id)),
          isNull(customer.deleted_at),
        ),
      );
    console.log(Customer);
    if (!Customer[0]) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
