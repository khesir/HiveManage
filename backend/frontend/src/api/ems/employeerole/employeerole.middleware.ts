import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { employee_role } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateEmployeeRoleID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { employee_role_id } = req.params;

  try {
    const EmployeeRole = await db
      .select()
      .from(employee_role)
      .where(
        and(
          eq(employee_role.employee_role_id, Number(employee_role_id)),
          isNull(employee_role.deleted_at),
        ),
      );
    console.log(EmployeeRole);
    if (!EmployeeRole[0]) {
      return res.status(404).json({ message: 'Employee Role not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
