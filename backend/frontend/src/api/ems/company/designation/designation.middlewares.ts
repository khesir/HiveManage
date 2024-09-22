import { and, eq, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/mysql/mysql.pool';
import { designation } from '@/drizzle/drizzle.schema';
import { HttpStatus } from '@/lib/HttpStatus';

export async function validateDesignationID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { designation_id } = req.params;

  try {
    const data = await db
      .select()
      .from(designation)
      .where(
        and(
          eq(designation.designation_id, Number(designation_id)),
          isNull(designation.deleted_at),
        ),
      );
    if (!data[0]) {
      return res
        .status(HttpStatus.NOT_FOUND.code)
        .json({ message: 'Designation not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
