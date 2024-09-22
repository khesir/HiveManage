import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '../../../../lib/logger';
import { db } from '../../../../mysql/mysql.pool';
import { reports } from '../../../../drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateReportsID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { reports_id } = req.params;

  try {
    const Reports = await db
      .select()
      .from(reports)
      .where(
        and(
          eq(reports.reports_id, Number(reports_id)),
          isNull(reports.deleted_at),
        ),
      );
    console.log(Reports);
    if (!Reports[0]) {
      return res.status(404).json({ message: 'Reports not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
