import { db } from '@/drizzle/pool';
import { discountProducts } from '@/drizzle/schema/ims';
import log from '@/lib/logger';
import { and, eq, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

export async function validateDiscountItemsID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { discount_product_id } = req.params;

  try {
    const DiscountItems = await db
      .select()
      .from(discountProducts)
      .where(
        and(
          eq(discountProducts.discount_product_id, Number(discount_product_id)),
          isNull(discountProducts.deleted_at),
        ),
      );
    console.log(DiscountItems);
    if (!DiscountItems[0]) {
      return res
        .status(404)
        .json({ message: 'Discount Items Group not found ' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
