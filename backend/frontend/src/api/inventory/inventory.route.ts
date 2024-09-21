import { Router } from 'express';
import arriveitemsRoute from './inventory/arriveItem/arriveItem.route';
import log from '../../../lib/logger';
import itemsRoute from './inventory/item/item.route';
import productRoute from './inventory/product/product.route';
import categoryRoute from './inventory/category/category.route';
import supplierRoute from './inventory/supplier/supplier.route';
import orderRoute from './inventory/order/order.route';

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

export default imsRoute;
