import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { remarkitems } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateRemarkItemsID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { remark_items_id } = req.params;

  try {
    const RemarkItems = await db
      .select()
      .from(remarkitems)
      .where(
        and(
          eq(remarkitems.remark_items_id, Number(remark_items_id)),
          isNull(remarkitems.deleted_at),
        ),
      );
    if (!RemarkItems[0]) {
      return res.status(404).json({ message: 'Remark Items not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
