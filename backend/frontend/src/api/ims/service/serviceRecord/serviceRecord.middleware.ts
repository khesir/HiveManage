import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { serviceRecord } from '@/drizzle/schema/ims/schema/service/serviceRecord.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateServiceRecordID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { service_record_id } = req.params;

  try {
    const data = await db
      .select()
      .from(serviceRecord)
      .where(
        and(
          eq(serviceRecord.service_record_id, Number(service_record_id)),
          isNull(serviceRecord.deleted_at),
        ),
      );

    if (!data[0]) {
      return res.status(404).json({ message: 'Service Record not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
