import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { OrderTransLog } from '@/drizzle/schema/records';

// There's a globally used
// middleware like error handling and schema validation

export async function validateOrderTransactionLogID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { order_transaction_id } = req.params;

  try {
    const data = await db
      .select()
      .from(OrderTransLog)
      .where(
        and(
          eq(OrderTransLog.order_transaction_id, Number(order_transaction_id)),
          isNull(OrderTransLog.deleted_at),
        ),
      );

    if (!data[0]) {
      return res
        .status(404)
        .json({ message: 'Order Transaction Log not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
