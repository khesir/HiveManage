import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/mysql/mysql.pool';
import { product } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateProductID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { product_id } = req.params;

  try {
    const Product = await db
      .select()
      .from(product)
      .where(
        and(
          eq(product.product_id, Number(product_id)),
          isNull(product.deleted_at),
        ),
      );
    console.log(Product);
    if (!Product[0]) {
      return res.status(404).json({ message: 'Product not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
