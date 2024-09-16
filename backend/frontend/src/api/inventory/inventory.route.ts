import { Router } from 'express';
import arriveitemsRoute from './inventory/arriveItem/arriveItem.route';
import log from '../../../lib/logger';

// import supplierRoute from './inventory/supplier/supplier.route';
// import itemRoute from './inventory/inventory.route';
// import tagitemRoute from './inventory/tag_items/tag_items.route';

const imsRoute = Router({ mergeParams: true });

// imsRoute.use('/supplier', supplierRoute);
// imsRoute.use('/inventory', itemRoute);
// imsRoute.use('/tag-items', tagitemRoute);
imsRoute.use('/arriveItems', arriveitemsRoute);
log.info('ROUTE arriveItems set ');

export default imsRoute;
