import { db } from '@/drizzle/pool';
import { customerGroup } from '@/drizzle/schema/customer';
import log from '@/lib/logger';
import { and, eq, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

export async function validateCustomerGroupID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { customer_group_id } = req.params;

  try {
    const CustomersGroup = await db
      .select()
      .from(customerGroup)
      .where(
        and(
          eq(customerGroup.customer_group_id, Number(customer_group_id)),
          isNull(customerGroup.deleted_at),
        ),
      );
    console.log(CustomersGroup);
    if (!CustomersGroup[0]) {
      return res.status(404).json({ message: 'Customer Group not found ' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
