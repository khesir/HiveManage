import { eq, and, isNull } from 'drizzle-orm';
import { sales_items } from '@/drizzle/drizzle.config';
import { NextFunction, Request, Response } from 'express';
import log from '@/lib/logger';
import { db } from '@/drizzle/pool';

// There's a globally used
// middleware like error handling and schema validation

export async function validateSalesItemID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { sales_item_id } = req.params;

  try {
    const SalesItem = await db
      .select()
      .from(sales_items)
      .where(
        and(
          eq(sales_items.sales_items_id, Number(sales_item_id)),
          isNull(sales_items.deleted_at),
        ),
      );
    console.log(SalesItem);
    if (!SalesItem[0]) {
      return res.status(404).json({ message: 'Sales Item not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
