import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { remarktickets } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateRemarkTicketsID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { remark_id } = req.params;

  try {
    const RemarkTickets = await db
      .select()
      .from(remarktickets)
      .where(
        and(
          eq(remarktickets.remark_id, Number(remark_id)),
          isNull(remarktickets.deleted_at),
        ),
      );

    if (!RemarkTickets[0]) {
      return res.status(404).json({ message: 'Remark Tickets not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
