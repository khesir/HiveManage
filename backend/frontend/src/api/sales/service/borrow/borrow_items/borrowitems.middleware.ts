import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { borrowItems } from '@/drizzle/schema/services';

// There's a globally used
// middleware like error handling and schema validation

export async function validateBorrowItemID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { borrow_item_id } = req.params;

  try {
    const BorrowItem = await db
      .select()
      .from(borrowItems)
      .where(
        and(
          eq(borrowItems.borrow_item_id, Number(borrow_item_id)),
          isNull(borrowItems.deleted_at),
        ),
      );
    console.log(BorrowItem);
    if (!BorrowItem[0]) {
      return res.status(404).json({ message: 'Borrow Item not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
