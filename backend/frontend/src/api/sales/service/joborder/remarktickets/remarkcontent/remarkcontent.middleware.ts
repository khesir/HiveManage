import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { remarkcontent } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateRemarkContentID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { remarkcontent_id } = req.params;

  try {
    const RemarkContent = await db
      .select()
      .from(remarkcontent)
      .where(
        and(
          eq(remarkcontent.remarkcontent_id, Number(remarkcontent_id)),
          isNull(remarkcontent.deleted_at),
        ),
      );
    console.log(RemarkContent);
    if (!RemarkContent[0]) {
      return res.status(404).json({ message: 'Remark Content not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
