import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { product, product_category } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateProductCategoryID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { product_category_id } = req.params;

  try {
    const ProductCategory = await db
      .select()
      .from(product)
      .where(
        and(
          eq(product_category.product_category_id, Number(product_category_id)),
          isNull(product_category.deleted_at),
        ),
      );
    console.log(ProductCategory);
    if (!ProductCategory[0]) {
      return res.status(404).json({ message: 'Product Category not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
