import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { remarkreports } from '@/drizzle/drizzle.config';

// There's a globally used
// middleware like error handling and schema validation

export async function validateRemarkReportsID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { remark_reports_id } = req.params;

  try {
    const RemarkReports = await db
      .select()
      .from(remarkreports)
      .where(
        and(
          eq(remarkreports.remark_reports_id, Number(remark_reports_id)),
          isNull(remarkreports.deleted_at),
        ),
      );
    console.log(RemarkReports);
    if (!RemarkReports[0]) {
      return res.status(404).json({ message: 'Remark Reports not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
