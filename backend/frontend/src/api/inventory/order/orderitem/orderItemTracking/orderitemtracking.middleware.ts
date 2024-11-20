import { orderItemTracking } from '@/drizzle/drizzle.schema';
import { db } from '@/drizzle/pool';
import { and, eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import log from '@/lib/logger';

export async function validateOrderItemId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { order_item_id } = req.params;
  try {
    const orderItem = await db
      .select()
      .from(orderItemTracking)
      .where(and(eq(orderItemTracking.orderItem_id, Number(order_item_id))));

    if (!orderItem[0]) {
      return res.status(400).json({ message: 'OrderItemTracking not found ' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
