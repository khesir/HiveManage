import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { participants } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateParticipantsID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { participants_id } = req.params;

  try {
    const Participants = await db
      .select()
      .from(participants)
      .where(
        and(
          eq(participants.participants_id, Number(participants_id)),
          isNull(participants.deleted_at),
        ),
      );
    console.log(Participants);
    if (!Participants[0]) {
      return res.status(404).json({ message: 'Participants not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
