import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { damageRecord } from '@/drizzle/schema/ims/schema/product/damageRecord.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateDamageRecordID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { damage_record_id } = req.params;

  try {
    const data = await db
      .select()
      .from(damageRecord)
      .where(
        and(
          eq(damageRecord.damage_record_id, Number(damage_record_id)),
          isNull(damageRecord.deleted_at),
        ),
      );

    if (!data[0]) {
      return res.status(404).json({ message: 'Damage Record not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
