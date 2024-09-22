import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/mysql/mysql.pool';
import { item } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateItemID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { item_id } = req.params;

  try {
    const Item = await db
      .select()
      .from(item)
      .where(and(eq(item.item_id, Number(item_id)), isNull(item.deleted_at)));
    console.log(Item);
    if (!Item[0]) {
      return res.status(404).json({ message: 'Item not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
