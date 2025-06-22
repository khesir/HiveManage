import { db } from '@/drizzle/pool';
import { eq, and, isNull } from 'drizzle-orm';

import { productSupplier } from '@/drizzle/schema/ims/schema/product/productSupplier.schema';
import { NextFunction, Request, Response } from 'express';
import log from '@/lib/logger';

export async function validateProductSupplierID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { product_supplier_id } = req.params;

  try {
    const exisitingProductSupplier = await db
      .select()
      .from(productSupplier)
      .where(
        and(
          eq(productSupplier.product_supplier_id, Number(product_supplier_id)),
          isNull(productSupplier.deleted_at),
        ),
      );
    if (!exisitingProductSupplier[0]) {
      return res.status(404).json({ message: 'Product Supplier not found ' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
