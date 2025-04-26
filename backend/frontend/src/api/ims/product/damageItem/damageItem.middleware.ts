import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { damageItem } from '@/drizzle/schema/ims/schema/product/damageItems.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateDamageItemID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { damage_item_id } = req.params;

  try {
    const data = await db
      .select()
      .from(damageItem)
      .where(
        and(
          eq(damageItem.damage_item_id, Number(damage_item_id)),
          isNull(damageItem.deleted_at),
        ),
      );

    if (!data[0]) {
      return res.status(404).json({ message: 'Damage Item not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
