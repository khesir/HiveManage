import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { salesItems } from '@/drizzle/schema/sales';

// There's a globally used
// middleware like error handling and schema validation

export async function validateSalesItemID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { sales_item_id } = req.params;

  try {
    const salesItem = await db
      .select()
      .from(salesItems)
      .where(
        and(
          eq(salesItems.sales_items_id, Number(sales_item_id)),
          isNull(salesItems.deleted_at),
        ),
      );
    console.log(salesItem);
    if (!salesItem[0]) {
      return res.status(404).json({ message: 'Sales Item not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
