import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { item_supplier } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateSupplierItemID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { item_supplier_id } = req.params;

  try {
    const SupplierItem = await db
      .select()
      .from(item_supplier)
      .where(
        and(
          eq(item_supplier.item_supplier_id, Number(item_supplier_id)),
          isNull(item_supplier.deleted_at),
        ),
      );

    if (!SupplierItem[0]) {
      return res.status(404).json({ message: 'Supplier Item not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
