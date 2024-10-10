import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { channel } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateChannelID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { channel_id } = req.params;

  try {
    const Channel = await db
      .select()
      .from(channel)
      .where(
        and(
          eq(channel.channel_id, Number(channel_id)),
          isNull(channel.deleted_at),
        ),
      );
    console.log(Channel);
    if (!Channel[0]) {
      return res.status(404).json({ message: 'Channel not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
