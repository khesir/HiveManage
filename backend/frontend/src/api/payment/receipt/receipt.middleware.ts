import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { receipt } from '@/drizzle/drizzle.config';

// There's a globally used
// middleware like error handling and schema validation

export async function validateReceiptID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { receipt_id } = req.params;

  try {
    const Receipt = await db
      .select()
      .from(receipt)
      .where(
        and(
          eq(receipt.receipt_id, Number(receipt_id)),
          isNull(receipt.deleted_at),
        ),
      );
    console.log(Receipt);
    if (!Receipt[0]) {
      return res.status(404).json({ message: 'Receipt not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
