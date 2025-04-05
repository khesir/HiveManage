import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { tickets } from '@/drizzle/schema/services';

// There's a globally used
// middleware like error handling and schema validation

export async function validateTicketsID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { ticket_id } = req.params;

  try {
    const Tickets = await db
      .select()
      .from(tickets)
      .where(
        and(
          eq(tickets.ticket_id, Number(ticket_id)),
          isNull(tickets.deleted_at),
        ),
      );

    if (!Tickets[0]) {
      return res.status(404).json({ message: 'Tickets not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
