import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { assignedemployees } from '@/drizzle/drizzle.config';

// There's a globally used
// middleware like error handling and schema validation

export async function validateAssignedEmployeeID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { assigned_employee_id } = req.params;

  try {
    const AssignedEmployees = await db
      .select()
      .from(assignedemployees)
      .where(
        and(
          eq(
            assignedemployees.assigned_employee_id,
            Number(assigned_employee_id),
          ),
          isNull(assignedemployees.deleted_at),
        ),
      );

    if (!AssignedEmployees[0]) {
      return res.status(404).json({ message: 'Assigned Employee not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
