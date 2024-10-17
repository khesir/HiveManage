import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';

import log from '@/lib/logger';
import { db } from '@/drizzle/pool';
import { stocksLogs } from '@/drizzle/drizzle.schema';

// There's a globally used
// middleware like error handling and schema validation

export async function validateStockLogsID(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { stock_id } = req.params;

  try {
    const stocks = await db
      .select()
      .from(stocksLogs)
      .where(eq(stocksLogs.stock_log_id, Number(stock_id)));
    console.log(stocks);
    if (!stocks[0]) {
      return res.status(404).json({ message: 'Stocklogs not found' });
    }
    next();
  } catch (error) {
    log.error(error);
    res.status(500).json({ message: 'Internal Server Error ' });
  }
}
