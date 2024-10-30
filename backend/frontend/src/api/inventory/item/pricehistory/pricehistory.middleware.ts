import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { price_history } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validatePriceHistoryID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { price_history_id } = req.params;

  try {
    const PriceHistory = await db
      .select()
      .from(price_history)
      .where(
        and(
          eq(price_history.price_history_id, Number(price_history_id)),
          isNull(price_history.deleted_at),
        ),
      );

    if (!PriceHistory[0]) {
      return res.status(404).json({ message: 'Price History not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
