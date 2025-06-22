import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { roles } from '@/drizzle/schema/ems';

// There's a globally used
// middleware like error handling and schema validation

export async function validateEmployeeRoleID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { roles_id } = req.params;

  try {
    const EmployeeRole = await db
      .select()
      .from(roles)
      .where(
        and(eq(roles.role_id, Number(roles_id)), isNull(roles.deleted_at)),
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
