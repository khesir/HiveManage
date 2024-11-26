import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { prdvariantsupp } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateProductVariantSupplierID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { prdvariantsupp_id } = req.params;

  try {
    const ProductVariantSupplier = await db
      .select()
      .from(prdvariantsupp)
      .where(
        and(
          eq(prdvariantsupp.prdvariantsupp_id, Number(prdvariantsupp_id)),
          isNull(prdvariantsupp.deleted_at),
        ),
      );
    console.log(ProductVariantSupplier);
    if (!ProductVariantSupplier[0]) {
      return res
        .status(404)
        .json({ message: 'Product Variant Supplier not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
