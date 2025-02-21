import { db } from '@/drizzle/pool';
import { couponredemptions } from '@/drizzle/schema/ims/schema/discount/couponredeem';
import log from '@/lib/logger';
import { and, eq, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

export async function validateCouponRedemptionID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { couponredemptions_id } = req.params;

  try {
    const Redemption = await db
      .select()
      .from(couponredemptions)
      .where(
        and(
          eq(
            couponredemptions.couponredemptions_id,
            Number(couponredemptions_id),
          ),
          isNull(couponredemptions.deleted_at),
        ),
      );
    console.log(Redemption);
    if (!Redemption[0]) {
      return res.status(404).json({ message: 'Coupon Redemption not found ' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
