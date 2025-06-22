import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { position } from '@/drizzle/schema/ems';

// There's a globally used
// middleware like error handling and schema validation

export async function validatePositionID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { position_id } = req.params;

  try {
    const EmployeeRole = await db
      .select()
      .from(position)
      .where(
        and(
          eq(position.position_id, Number(position_id)),
          isNull(position.deleted_at),
        ),
      );
    if (!EmployeeRole[0]) {
      return res.status(404).json({ message: 'Employee Role not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
