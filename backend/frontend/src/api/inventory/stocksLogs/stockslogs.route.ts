import { Router } from 'express';
import { StocksLogsController } from './stockslogs.controller';
import { db } from '@/drizzle/pool';
import { validateStockLogsID } from './stockslogs.middleware';

const stockLogsRoute = Router({ mergeParams: true });
const stocksLogsController = new StocksLogsController(db);

stockLogsRoute.get(
  '/',
  stocksLogsController.getAllStocksLogs.bind(stocksLogsController),
);

stockLogsRoute.get(
  '/:stock_id',
  validateStockLogsID,
  stocksLogsController.getStockLogById.bind(stocksLogsController),
);

export default stockLogsRoute;
