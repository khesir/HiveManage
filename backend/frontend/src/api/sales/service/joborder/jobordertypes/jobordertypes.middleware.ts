import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { jobordertype } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateJobOrderTypesID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { joborder_type_id } = req.params;

  try {
    const JobOrderTypes = await db
      .select()
      .from(jobordertype)
      .where(
        and(
          eq(jobordertype.joborder_type_id, Number(joborder_type_id)),
          isNull(jobordertype.deleted_at),
        ),
      );
    console.log(JobOrderTypes);
    if (!JobOrderTypes[0]) {
      return res.status(404).json({ message: 'Job Order Types not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
