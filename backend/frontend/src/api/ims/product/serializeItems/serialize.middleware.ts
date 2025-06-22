import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { serializeProduct } from '@/drizzle/schema/ims';

// There's a globally used
// middleware like error handling and schema validation

export async function validateSerializedProductID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { serial_id } = req.params;

  try {
    const data = await db
      .select()
      .from(serializeProduct)
      .where(
        and(
          eq(serializeProduct.serial_id, Number(serial_id)),
          isNull(serializeProduct.deleted_at),
        ),
      );

    if (!data[0]) {
      return res.status(404).json({ message: 'Serialize Product not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
