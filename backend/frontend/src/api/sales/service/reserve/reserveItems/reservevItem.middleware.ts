import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { reserveItems } from '@/drizzle/schema/services';

// There's a globally used
// middleware like error handling and schema validation

export async function validateReserveItemID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { reserve_item_id } = req.params;

  try {
    const ReserveItem = await db
      .select()
      .from(reserveItems)
      .where(
        and(
          eq(reserveItems.reserve_item_id, Number(reserve_item_id)),
          isNull(reserveItems.deleted_at),
        ),
      );
    console.log(ReserveItem);
    if (!ReserveItem[0]) {
      return res.status(404).json({ message: 'Reserve Item not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
