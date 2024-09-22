import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/mysql/mysql.pool';
import { category } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateCategoryID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { category_id } = req.params;

  try {
    const Category = await db
      .select()
      .from(category)
      .where(
        and(
          eq(category.category_id, Number(category_id)),
          isNull(category.deleted_at),
        ),
      );
    console.log(Category);
    if (!Category[0]) {
      return res.status(404).json({ message: 'Category not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
