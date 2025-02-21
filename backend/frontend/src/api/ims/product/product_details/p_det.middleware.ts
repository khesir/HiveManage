import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { productDetails } from '@/drizzle/schema/ims';

// There's a globally used
// middleware like error handling and schema validation

export async function validateProductDetailsID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { p_details_id } = req.params;

  try {
    const ProductDetails = await db
      .select()
      .from(productDetails)
      .where(
        and(
          eq(productDetails.p_details_id, Number(p_details_id)),
          isNull(productDetails.deleted_at),
        ),
      );

    if (!ProductDetails[0]) {
      return res.status(404).json({ message: 'Product Details not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
