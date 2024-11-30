import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { variant } from '@/drizzle/drizzle.schema';
import multer from 'multer';

// There's a globally used
// middleware like error handling and schema validation

export async function validateProductVariantID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { variant_id } = req.params;

  try {
    const ProductVariant = await db
      .select()
      .from(variant)
      .where(
        and(
          eq(variant.variant_id, Number(variant_id)),
          isNull(variant.deleted_at),
        ),
      );
    console.log(ProductVariant);
    if (!ProductVariant[0]) {
      return res.status(404).json({ message: 'Product Variant not found' });
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
