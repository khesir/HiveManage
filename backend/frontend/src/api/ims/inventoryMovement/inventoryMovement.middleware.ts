import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { inventoryMovement } from '@/drizzle/schema/ims/schema/product/inventoryMovement.schema';
// There's a globally used
// middleware like error handling and schema validation

export async function validateInventoryMovementID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { inventory_movement_id } = req.params;

  try {
    const data = await db
      .select()
      .from(inventoryMovement)
      .where(
        and(
          eq(
            inventoryMovement.inventory_movement_id,
            Number(inventory_movement_id),
          ),
          isNull(inventoryMovement.deleted_at),
        ),
      );

    if (!data[0]) {
      return res.status(404).json({ message: 'Inventory Movement not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
