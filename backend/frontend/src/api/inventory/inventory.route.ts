import { Router } from 'express';
import categoryRoute from './inventory/category/category.route';
import log from '../../../lib/logger';

// import supplierRoute from './inventory/supplier/supplier.route';
// import itemRoute from './inventory/inventory.route';
// import tagitemRoute from './inventory/tag_items/tag_items.route';

const imsRoute = Router({ mergeParams: true });

// imsRoute.use('/supplier', supplierRoute);
// imsRoute.use('/inventory', itemRoute);
// imsRoute.use('/tag-items', tagitemRoute);
imsRoute.use('/category', categoryRoute);
log.info('ROUTE category set');

export default imsRoute;
