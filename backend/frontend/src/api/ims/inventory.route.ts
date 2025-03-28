import { Router } from 'express';
import log from '@/lib/logger';
import productRoute from './product/product.route';
import categoryRoute from './category/category.route';
import supplierRoute from './supplier/supplier.route';
import orderRoute from './order/order.route';
import productSuppplierRoute from './product/productSupplier/productSupplier.route';
import orderitemsRoute from './order/orderitem/orderitem.route';

const imsRoute = Router({ mergeParams: true });

imsRoute.use('/supplier', supplierRoute);
imsRoute.use('/order', orderRoute);
imsRoute.use('/orderProduct', orderitemsRoute);

imsRoute.use('/product', productRoute);
imsRoute.use('/productSupplier', productSuppplierRoute);
log.info('ROUTE /product set');

imsRoute.use('/category', categoryRoute);
log.info('ROUTE category set');

export default imsRoute;
