import {
  decimal,
  integer,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { order } from './order.schema';
import { product } from '../product/product.schema';

export const orderProduct = pgTable('order_product', {
  order_product_id: serial('order_product_id').primaryKey(),
  order_id: integer('order_id').references(() => order.order_id),
  product_id: integer('product_id').references(() => product.product_id),

  quantity: integer('quantity').default(1),
  unit_price: decimal('unit_price', { precision: 50, scale: 2 }),
  discount_amount: decimal('discount_amount', { precision: 50, scale: 2 }),

  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
