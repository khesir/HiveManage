import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/mysql/mysql.pool';
import { message } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateMessageID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { message_id } = req.params;

  try {
    const Message = await db
      .select()
      .from(message)
      .where(
        and(
          eq(message.message_id, Number(message_id)),
          isNull(message.deleted_at),
        ),
      );
    console.log(Message);
    if (!Message[0]) {
      return res.status(404).json({ message: 'Message not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
