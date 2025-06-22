import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { serviceLog } from '@/drizzle/schema/records/schema/serviceLog';

// There's a globally used
// middleware like error handling and schema validation

export async function validateSalesLogID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { service_log_id } = req.params;

  try {
    const data = await db
      .select()
      .from(serviceLog)
      .where(
        and(
          eq(serviceLog.service_log_id, Number(service_log_id)),
          isNull(serviceLog.deleted_at),
        ),
      );

    if (!data[0]) {
      return res.status(404).json({ message: 'Sales Log not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
