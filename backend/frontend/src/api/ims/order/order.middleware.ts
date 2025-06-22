import { eq, and, isNull } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { HttpStatus } from '@/lib/HttpStatus';
import { order, product } from '@/drizzle/schema/ims';

// There's a globally used
// middlewere like error handling and schema validation

export async function validateOrderId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { order_id } = req.params;

  try {
    const Order = await db
      .select()
      .from(order)
      .where(
        and(eq(order.order_id, Number(order_id)), isNull(order.deleted_at)),
      );
    if (!Order[0]) {
      return res.status(400).json({ message: 'Order not found ' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}

export async function validateOrderByProductId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { product_id } = req.body;

  try {
    const data = await db
      .select()
      .from(product)
      .where(
        and(
          eq(product.product_id, Number(product_id)),
          isNull(product.deleted_at),
        ),
      );
    if (!data[0]) {
      return res
        .status(HttpStatus.NOT_FOUND.code)
        .json({ message: 'Product not found ' });
    }
    next();
  } catch (error) {
    log.error(error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .json({ message: 'Internal Server Error ' });
  }
}

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
