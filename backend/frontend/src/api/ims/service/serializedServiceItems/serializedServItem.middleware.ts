import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { serializedserviceRecord } from '@/drizzle/schema/ims/schema/service/serviceSerializeItem.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateSerializedServiceItemID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { service_serilize_record_id } = req.params;

  try {
    const data = await db
      .select()
      .from(serializedserviceRecord)
      .where(
        and(
          eq(
            serializedserviceRecord.service_serilize_record_id,
            Number(service_serilize_record_id),
          ),
          isNull(serializedserviceRecord.deleted_at),
        ),
      );

    if (!data[0]) {
      return res
        .status(404)
        .json({ message: 'Serialize Service Item not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
