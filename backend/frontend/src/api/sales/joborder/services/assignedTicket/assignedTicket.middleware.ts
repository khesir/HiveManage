import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { assignedTicket } from '@/drizzle/schema/services';
// There's a globally used
// middleware like error handling and schema validation

export async function validateAssignedTicketeID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { assigned_ticket_id } = req.params;

  try {
    const recentTickets = await db
      .select()
      .from(assignedTicket)
      .where(
        and(
          eq(assignedTicket.assigned_ticket_id, Number(assigned_ticket_id)),
          isNull(assignedTicket.deleted_at),
        ),
      );

    if (!recentTickets[0]) {
      return res.status(404).json({ message: 'Assigned Ticket not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
