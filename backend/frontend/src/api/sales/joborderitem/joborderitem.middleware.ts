import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { joborderitems } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateJobOrderItemsID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { joborderitems_id } = req.params;

  try {
    const JobOrderItem = await db
      .select()
      .from(joborderitems)
      .where(
        and(
          eq(joborderitems.joborderitems_id, Number(joborderitems_id)),
          isNull(joborderitems.deleted_at),
        ),
      );

    if (!JobOrderItem[0]) {
      return res.status(404).json({ message: 'Job Order Items not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
