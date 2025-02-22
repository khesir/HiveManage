import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { serializeProducts } from '@/drizzle/schema/ims';

// There's a globally used
// middleware like error handling and schema validation

export async function validateSerializedProductID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { serialized_item_id } = req.params;

  try {
    const data = await db
      .select()
      .from(serializeProducts)
      .where(
        and(
          eq(serializeProducts.serialized_item_id, Number(serialized_item_id)),
          isNull(serializeProducts.deleted_at),
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
