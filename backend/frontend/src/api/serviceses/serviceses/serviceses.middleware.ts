import { eq, and, isNull } from 'drizzle-orm';
import { service } from '../../../../drizzle/drizzle.schema';
import { NextFunction, Request, Response } from 'express';

import log from '../../../../lib/logger';
import { db } from '../../../../mysql/mysql.pool';

// There's a globally used
// middleware like error handling and schema validation

export async function validateServiceID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { service_id } = req.params;

  try {
    const Service = await db
      .select()
      .from(service)
      .where(
        and(
          eq(service.service_id, Number(service_id)),
          isNull(service.deleted_at),
        ),
      );
    console.log(Service);
    if (!Service[0]) {
      return res.status(404).json({ message: 'Service not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
