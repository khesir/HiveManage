import { Router } from 'express';
import arriveitemsRoute from './inventory/arriveItem/arriveItem.route';
import log from '../../../lib/logger';

import log from '../../../lib/logger';
import itemsRoute from './inventory/item/item.route';

import productRoute from './inventory/product/product.route';
import log from '../../../lib/logger';

import categoryRoute from './inventory/category/category.route';
import log from '../../../lib/logger';

import supplierRoute from './inventory/supplier/supplier.route';
import orderRoute from './inventory/order/order.route';


// import itemRoute from './inventory/inventory.route';
// import tagitemRoute from './inventory/tag_items/tag_items.route';

const imsRoute = Router({ mergeParams: true });

imsRoute.use('/supplier', supplierRoute);
imsRoute.use('/order', orderRoute);
// imsRoute.use('/inventory', itemRoute);
// imsRoute.use('/tag-items', tagitemRoute);
imsRoute.use('/arriveItems', arriveitemsRoute);
log.info('ROUTE arriveItems set ');

imsRoute.use('/item', itemsRoute);
log.info('ROUTE /item set');

imsRoute.use('/product', productRoute);
log.info('ROUTE /product set');

imsRoute.use('/category', categoryRoute);
log.info('ROUTE category set');

export default imsRoute;
