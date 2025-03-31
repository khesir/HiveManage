import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { ProductTransLog } from '@/drizzle/schema/logs';

// There's a globally used
// middleware like error handling and schema validation

export async function validateOrderTransactionLogID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { product_transaction_id } = req.params;

  try {
    const data = await db
      .select()
      .from(ProductTransLog)
      .where(
        and(
          eq(
            ProductTransLog.product_transaction_id,
            Number(product_transaction_id),
          ),
          isNull(ProductTransLog.deleted_at),
        ),
      );

    if (!data[0]) {
      return res
        .status(404)
        .json({ message: 'Product Transaction Log not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
