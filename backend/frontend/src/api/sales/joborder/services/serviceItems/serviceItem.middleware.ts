import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { serviceItem } from '@/drizzle/schema/services/schema/service/serviceItems';

// There's a globally used
// middleware like error handling and schema validation

export async function validateServiceItemID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { service_item_id } = req.params;

  try {
    const data = await db
      .select()
      .from(serviceItem)
      .where(
        and(
          eq(serviceItem.service_item_id, Number(service_item_id)),
          isNull(serviceItem.deleted_at),
        ),
      );

    if (!data[0]) {
      return res.status(404).json({ message: 'Service Item not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
