import { Router } from 'express';
import log from '@/lib/logger';
import productRoute from './product/product.route';
import categoryRoute from './category/category.route';
import supplierRoute from './supplier/supplier.route';
import orderRoute from './order/order.route';
import stockLogsRoute from './stocksLogs/stockslogs.route';
import productvariantRoute from './product/prodvar/prodvar.route';

const imsRoute = Router({ mergeParams: true });

imsRoute.use('/supplier', supplierRoute);
imsRoute.use('/order', orderRoute);

imsRoute.use('/product', productRoute);
log.info('ROUTE /product set');

imsRoute.use('/category', categoryRoute);
log.info('ROUTE category set');

imsRoute.use('/stock-logs', stockLogsRoute);
log.info('ROUTE StockLogs set');

imsRoute.use('/variants', productvariantRoute);
log.info('ROUTE variant set');

export default imsRoute;
