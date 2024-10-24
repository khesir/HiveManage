import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { product_attachment } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateProductAttachmentID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { product_attachment_id } = req.params;

  try {
    const ProductAttachment = await db
      .select()
      .from(product_attachment)
      .where(
        and(
          eq(
            product_attachment.product_attachment_id,
            Number(product_attachment_id),
          ),
          isNull(product_attachment.deleted_at),
        ),
      );
    console.log(ProductAttachment);
    if (!ProductAttachment[0]) {
      return res.status(404).json({ message: 'Product Attachment not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
