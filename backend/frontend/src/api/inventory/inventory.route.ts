import { Router } from 'express';
import supplierRoute from './inventory/supplier/supplier.route';
import orderRoute from './inventory/order/order.route';

// import itemRoute from './inventory/inventory.route';
// import tagitemRoute from './inventory/tag_items/tag_items.route';

const imsRoute = Router({ mergeParams: true });

imsRoute.use('/supplier', supplierRoute);
imsRoute.use('/order', orderRoute);
// imsRoute.use('/inventory', itemRoute);
// imsRoute.use('/tag-items', tagitemRoute);

export default imsRoute;
