import { Router } from 'express';
import log from '@/lib/logger';
import productRoute from './product/product.route';
import categoryRoute from './category/category.route';
import supplierRoute from './supplier/supplier.route';

const imsRoute = Router({ mergeParams: true });

imsRoute.use('/supplier', supplierRoute);
// imsRoute.use('/order', orderRoute);

imsRoute.use('/product', productRoute);
log.info('ROUTE /product set');

imsRoute.use('/category', categoryRoute);
log.info('ROUTE category set');

export default imsRoute;
