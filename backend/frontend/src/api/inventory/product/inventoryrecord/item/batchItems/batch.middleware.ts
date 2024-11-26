import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { batchItems } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateBatchID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { batch_id } = req.params;

  try {
    const data = await db
      .select()
      .from(batchItems)
      .where(
        and(
          eq(batchItems.batch_item_id, Number(batch_id)),
          isNull(batchItems.deleted_at),
        ),
      );

    if (!data[0]) {
      return res.status(404).json({ message: 'Batch Items not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
