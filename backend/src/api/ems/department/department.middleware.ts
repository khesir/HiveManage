import { and, eq, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { HttpStatus } from '@/lib/HttpStatus';
import { db } from '@/drizzle/pool';
import { department } from '@/drizzle/schema/ems';

export async function validateDepartmentID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { department_id } = req.params;

  try {
    const data = await db
      .select()
      .from(department)
      .where(
        and(
          eq(department.department_id, Number(department_id)),
          isNull(department.deleted_at),
        ),
      );
    if (!data[0]) {
      return res
        .status(HttpStatus.NOT_FOUND.code)
        .json({ message: 'Department not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
