import { Router } from 'express';
import { validateRequest } from '@/src/middlewares';
import { db } from '@/drizzle/pool';
import log from '@/lib/logger';
import { PriceHistoryController } from './pricehistory.controller';
import { validatePriceHistoryID } from './pricehistory.middleware';
import { CreatePriceHistory, UpdatePriceHistory } from './pricehistory.model';

const priceHistoryRoute = Router({ mergeParams: true });
const priceHistoryController = new PriceHistoryController(db);

priceHistoryRoute.get(
  '/',
  priceHistoryController.getAllPriceHistory.bind(priceHistoryController),
);
log.info('GET /pricehistory set');

priceHistoryRoute.get(
  '/:price_history_id',
  validatePriceHistoryID,
  priceHistoryController.getPriceHistoryById.bind(priceHistoryController),
);
log.info('GET /pricehistory/:price_history_id set');

priceHistoryRoute.post(
  '/',
  [validateRequest({ body: CreatePriceHistory })],
  priceHistoryController.createPriceHistory.bind(priceHistoryController),
);
log.info('POST /pricehistory/ set ');

priceHistoryRoute.put(
  '/:price_history_id',
  [validateRequest({ body: UpdatePriceHistory }), validatePriceHistoryID],
  priceHistoryController.updatePriceHistory.bind(priceHistoryController),
);
log.info('PUT /pricehistory/:price_history_id set ');

priceHistoryRoute.delete(
  '/:price_history_id',
  validatePriceHistoryID,
  priceHistoryController.deletePriceHistory.bind(priceHistoryController),
);
log.info('DELETE /pricehistory/:price_history_id set');

export default priceHistoryRoute;
