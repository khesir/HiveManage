import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { OrderLog } from '@/drizzle/schema/records';

// There's a globally used
// middleware like error handling and schema validation

export async function validateOrderTransactionLogID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { order_log_id } = req.params;

  try {
    const data = await db
      .select()
      .from(OrderLog)
      .where(
        and(
          eq(OrderLog.order_log_id, Number(order_log_id)),
          isNull(OrderLog.deleted_at),
        ),
      );

    if (!data[0]) {
      return res.status(404).json({ message: 'Order Log not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
