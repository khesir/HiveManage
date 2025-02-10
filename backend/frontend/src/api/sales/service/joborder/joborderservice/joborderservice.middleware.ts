import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { joborder_services } from '@/drizzle/drizzle.config';

// There's a globally used
// middleware like error handling and schema validation

export async function validateJobOrderServiceID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { joborder_services_id } = req.params;

  try {
    const JobOrderService = await db
      .select()
      .from(joborder_services)
      .where(
        and(
          eq(
            joborder_services.joborder_services_id,
            Number(joborder_services_id),
          ),
          isNull(joborder_services.deleted_at),
        ),
      );
    console.log(JobOrderService);
    if (!JobOrderService[0]) {
      return res.status(404).json({ message: 'Job Order Service not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
