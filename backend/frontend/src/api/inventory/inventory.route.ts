import { Router } from 'express';
import log from '../../../lib/logger';
import itemsRoute from './inventory/item/item.route';

// import supplierRoute from './inventory/supplier/supplier.route';
// import itemRoute from './inventory/inventory.route';
// import tagitemRoute from './inventory/tag_items/tag_items.route';

const imsRoute = Router({ mergeParams: true });

// imsRoute.use('/supplier', supplierRoute);
// imsRoute.use('/inventory', itemRoute);
// imsRoute.use('/tag-items', tagitemRoute);
imsRoute.use('/item', itemsRoute);
log.info('ROUTE /item set');

export default imsRoute;
