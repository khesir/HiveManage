import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { productRecord } from '@/drizzle/schema/ims';

// There's a globally used
// middleware like error handling and schema validation

export async function validateProductRecordID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { product_record_id } = req.params;

  try {
    const ProductRecord = await db
      .select()
      .from(productRecord)
      .where(
        and(
          eq(productRecord.product_record_id, Number(product_record_id)),
          isNull(productRecord.deleted_at),
        ),
      );

    if (!ProductRecord[0]) {
      return res.status(404).json({ message: 'Product Record not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
