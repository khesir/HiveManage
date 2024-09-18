import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '../../../../../lib/logger';
import { db } from '../../../../../mysql/mysql.pool';
import { arrived_Items } from '../../../../../drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateArriveItemsID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { arrive_items_id } = req.params;

  try {
    const ArriveItems = await db
      .select()
      .from(arrived_Items)
      .where(
        and(
          eq(arrived_Items.arrived_Items_id, Number(arrive_items_id)),
          isNull(arrived_Items.deleted_at),
        ),
      );
    console.log(ArriveItems);
    if (!ArriveItems[0]) {
      return res.status(404).json({ message: 'Arrive Items not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
