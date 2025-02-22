import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { borrow } from '@/drizzle/schema/services/schema/borrow/borrow.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateBorrowID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { borrow_id } = req.params;

  try {
    const Borrow = await db
      .select()
      .from(borrow)
      .where(
        and(eq(borrow.borrow_id, Number(borrow_id)), isNull(borrow.deleted_at)),
      );
    console.log(Borrow);
    if (!Borrow[0]) {
      return res.status(404).json({ message: 'Borrow not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
