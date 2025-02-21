import { db } from '@/drizzle/pool';
import { discountCustomer } from '@/drizzle/schema/ims';
import log from '@/lib/logger';
import { and, eq, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

export async function validateDiscountCustomerID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { discount_customer_id } = req.params;

  try {
    const DiscountCustomer = await db
      .select()
      .from(discountCustomer)
      .where(
        and(
          eq(
            discountCustomer.discount_customer_id,
            Number(discount_customer_id),
          ),
          isNull(discountCustomer.deleted_at),
        ),
      );
    console.log(DiscountCustomer);
    if (!DiscountCustomer[0]) {
      return res
        .status(404)
        .json({ message: 'Discount Customer Group not found ' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
