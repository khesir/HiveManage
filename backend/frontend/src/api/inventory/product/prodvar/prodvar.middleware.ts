import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { variant } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateProductVariantID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { variant_id } = req.params;

  try {
    const ProductVariant = await db
      .select()
      .from(variant)
      .where(
        and(
          eq(variant.variant_id, Number(variant_id)),
          isNull(variant.deleted_at),
        ),
      );
    console.log(ProductVariant);
    if (!ProductVariant[0]) {
      return res.status(404).json({ message: 'Product Variant not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
