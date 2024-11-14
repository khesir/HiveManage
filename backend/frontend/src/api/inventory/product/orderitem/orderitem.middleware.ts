import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { item, orderItem } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateOrderItemID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { orderItem_id } = req.params;

  try {
    const OrderItem = await db
      .select()
      .from(item)
      .where(
        and(
          eq(orderItem.orderItem_id, Number(orderItem_id)),
          isNull(item.deleted_at),
        ),
      );

    if (!OrderItem[0]) {
      return res.status(404).json({ message: 'Order Item not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
