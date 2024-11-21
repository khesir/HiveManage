import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { item_record } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateInventoryRecordID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { item_record_id } = req.params;

  try {
    const InventoryRecord = await db
      .select()
      .from(item_record)
      .where(
        and(
          eq(item_record.item_record_id, Number(item_record_id)),
          isNull(item_record.deleted_at),
        ),
      );

    if (!InventoryRecord[0]) {
      return res.status(404).json({ message: 'Inventory Record not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
