import { Router } from 'express';
import log from '@/lib/logger';
import productRoute from './product/product.route';
import categoryRoute from './category/category.route';
import supplierRoute from './supplier/supplier.route';
import orderRoute from './order/order.route';
import arriveitemsRoute from './arriveItem/arriveItem.route';
import itemsRoute from './item/item.route';
import stockLogsRoute from './stocksLogs/stockslogs.route';

const imsRoute = Router({ mergeParams: true });

imsRoute.use('/supplier', supplierRoute);
imsRoute.use('/order', orderRoute);

imsRoute.use('/arriveItems', arriveitemsRoute);
log.info('ROUTE arriveItems set ');

imsRoute.use('/item', itemsRoute);
log.info('ROUTE /item set');

imsRoute.use('/product', productRoute);
log.info('ROUTE /product set');

imsRoute.use('/category', categoryRoute);
log.info('ROUTE category set');

imsRoute.use('/stockLogs', stockLogsRoute);
log.info('ROUTE StockLogs set');

export default imsRoute;
