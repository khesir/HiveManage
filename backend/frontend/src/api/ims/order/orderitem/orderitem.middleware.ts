import { eq, and } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { orderProduct } from '@/drizzle/schema/ims';

export async function validateOrderItemID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { order_item_id } = req.params;

  try {
    const OrderItem = await db
      .select()
      .from(orderProduct)
      .where(and(eq(orderProduct.order_product_id, Number(order_item_id))));

    if (!OrderItem[0]) {
      return res.status(404).json({ message: 'Order Item not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
