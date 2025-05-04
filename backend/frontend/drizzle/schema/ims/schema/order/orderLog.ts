import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { orderProduct } from './orderItem.schema';
import { order } from './order.schema';
import { employee } from '@/drizzle/schema/ems';
import { product } from '../product/product.schema';

export const orderLogActionType = pgEnum('order_log_action_type', [
  'Added to inventory',
  'Resolved',
  'Delivered',
  'Ordered',
  'Returned',
]);

export const orderLogStatus = pgEnum('order_log_status', [
  'Delivered',
  'Pending',
  'Resolved',
  'Approved',
  'Refunded',
]);

export const OrderLog = pgTable('OrderTransLog', {
  order_log_id: serial('order_log_id').primaryKey(),
  order_id: integer('order_id').references(() => order.order_id),
  order_item_id: integer('order_item_id').references(
    () => orderProduct.order_product_id,
  ),
  product_id: integer('product_id').references(() => product.product_id),

  total_quantity: integer('total_quantity').notNull(),
  ordered_quantity: integer('ordered_quantity').default(0),
  delivered_quantity: integer('delivered_quantity').default(0),
  resolved_quantity: integer('resolve_quantity').default(0),

  status: orderLogStatus('status'),
  action_type: orderLogActionType('action_type'),
  performed_by: integer('performed_by').references(() => employee.employee_id),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
