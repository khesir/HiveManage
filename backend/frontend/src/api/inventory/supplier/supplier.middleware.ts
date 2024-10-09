import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { supplier } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateSupplierID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { supplier_id } = req.params;

  try {
    const Supplier = await db
      .select()
      .from(supplier)
      .where(
        and(
          eq(supplier.supplier_id, Number(supplier_id)),
          isNull(supplier.deleted_at),
        ),
      );
    console.log(Supplier);
    if (!Supplier[0]) {
      return res.status(404).json({ message: 'Supplier not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
