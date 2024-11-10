import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { employee, employee_roles } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validatEmployeeRoleID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { employee_role_id } = req.params;
  try {
    const EmployeeAccount = await db
      .select()
      .from(employee_roles)
      .where(
        and(
          eq(employee_roles.employee_roles_id, Number(employee_role_id)),
          isNull(employee_roles.deleted_at),
        ),
      );
    if (!EmployeeAccount) {
      return res.status(404).json({ message: 'Employee Account not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}

export async function validateEmployeeEmail(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { email } = req.query;
  const employeeIds: number[] = [];
  if (!email) {
    return res.status(404).json({ message: 'Please add email to the query' });
  }
  try {
    const employeeData = await db
      .select()
      .from(employee)
      .where(
        and(eq(employee.email, String(email)), isNull(employee.deleted_at)),
      );
    employeeIds.push(...employeeData.map((emp) => emp.employee_id));
    console.log(employeeData);
    if (employeeIds.length > 0) {
      return res.status(404).json({ message: 'Email is already used' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3;
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg'];

export const multerbase = multer({
  limits: { fileSize: MAX_UPLOAD_SIZE },
  fileFilter: (req, file, cb) => {
    if (ACCEPTED_FILE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PNG or JPEG files are allowed'));
    }
  },
});

export const formDataToObject = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any> = {};

  Object.keys(req.body).forEach((key) => {
    const value = req.body[key];

    if (value instanceof File) {
      data[key] = value;
    } else {
      data[key] = value;
    }
  });
  req.body = data;
  next();
};
