import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { sales } from '@/drizzle/schema/sales';

export async function validateSalesID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { sales_id } = req.params;

  try {
    const Sales = await db
      .select()
      .from(sales)
      .where(
        and(eq(sales.sales_id, Number(sales_id)), isNull(sales.deleted_at)),
      );
    console.log(Sales);
    if (!Sales[0]) {
      return res.status(404).json({ message: 'Sales not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
