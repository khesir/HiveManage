import {
  boolean,
  decimal,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { order } from './order.schema';
import { product } from '../product/product.schema';
export const orderItemStatus = pgEnum('status', [
  'Draft',
  'Finalized',
  'Awaiting Arrival',
  'Partially Delivered',
  'Delivered',
  'Cancelled',
  'Returned',
  'Partially Stocked',
  'Stocked',
]);
export const orderProduct = pgTable('order_product', {
  order_product_id: serial('order_product_id').primaryKey(),
  order_id: integer('order_id').references(() => order.order_id),
  product_id: integer('product_id').references(() => product.product_id),

  total_quantity: integer('total_quantity').notNull(),
  ordered_quantity: integer('ordered_quantity').default(0),
  delivered_quantity: integer('delivered_quantity').default(0),

  cost_price: decimal('cost_price', { precision: 50, scale: 2 }),
  selling_price: decimal('selling_price', { precision: 50, scale: 2 }),

  status: orderItemStatus('status').notNull(),
  is_serialize: boolean('is_serialize').default(false),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
