import { Router } from 'express';
import productRoute from './product/product.route';
import categoryRoute from './category/category.route';
import supplierRoute from './supplier/supplier.route';
import orderRoute from './order/order.route';
import productSuppplierRoute from './product/productSupplier/productSupplier.route';
import orderitemsRoute from './order/orderitem/orderitem.route';
import orderlogRoute from './order/orderitem/OrderTransLogs/OTL.route';

const imsRoute = Router({ mergeParams: true });

imsRoute.use('/supplier', supplierRoute);
imsRoute.use('/order', orderRoute);
imsRoute.use('/order-product', orderitemsRoute);

imsRoute.use('/product', productRoute);
imsRoute.use('/productSupplier', productSuppplierRoute);

imsRoute.use('/category', categoryRoute);

imsRoute.use('/orderlogs', orderlogRoute);
export default imsRoute;
