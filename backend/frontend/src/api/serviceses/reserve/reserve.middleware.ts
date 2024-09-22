import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '../../../../lib/logger';
import { db } from '../../../../mysql/mysql.pool';
import { reserve } from '../../../../drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateReserveID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { reserve_id } = req.params;

  try {
    const Reserve = await db
      .select()
      .from(reserve)
      .where(
        and(
          eq(reserve.reserve_id, Number(reserve_id)),
          isNull(reserve.deleted_at),
        ),
      );
    console.log(Reserve);
    if (!Reserve[0]) {
      return res.status(404).json({ message: 'Reserve not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
