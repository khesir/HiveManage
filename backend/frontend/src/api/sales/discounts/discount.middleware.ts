import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { discount } from '@/drizzle/schema/ims';

// There's a globally used
// middleware like error handling and schema validation

export async function validateDiscountID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { discount_id } = req.params;

  try {
    const Discount = await db
      .select()
      .from(discount)
      .where(
        and(
          eq(discount.discount_id, Number(discount_id)),
          isNull(discount.deleted_at),
        ),
      );
    console.log(Discount);
    if (!Discount[0]) {
      return res.status(404).json({ message: 'Discount not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
