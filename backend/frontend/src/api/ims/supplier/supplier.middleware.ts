import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import multer from 'multer';
import { supplier } from '@/drizzle/schema/ims';

// There's a globally used
// middleware like error handling and schema validation

export async function validateSupplierID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { supplier_id } = req.params;

  try {
    const Supplier = await db
      .select()
      .from(supplier)
      .where(
        and(
          eq(supplier.supplier_id, Number(supplier_id)),
          isNull(supplier.deleted_at),
        ),
      );
    console.log(Supplier);
    if (!Supplier[0]) {
      return res.status(404).json({ message: 'Supplier not found' });
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
      try {
        const parsedValue = JSON.parse(value);
        data[key] = parsedValue;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // If it's not valid JSON, leave it as is
        data[key] = value;
      }
    }
  });
  req.body = data;
  next();
};
