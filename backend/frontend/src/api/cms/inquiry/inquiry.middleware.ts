import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/mysql/mysql.pool';
import { inquiry } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateInquiryID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { inquiry_id } = req.params;

  try {
    const Inquiry = await db
      .select()
      .from(inquiry)
      .where(
        and(
          eq(inquiry.inquiry_id, Number(inquiry_id)),
          isNull(inquiry.deleted_at),
        ),
      );
    console.log(Inquiry);
    if (!Inquiry[0]) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
