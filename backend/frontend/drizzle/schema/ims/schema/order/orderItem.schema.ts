import {
  decimal,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { order } from './order.schema';

export const orderItem = pgTable('orderItem', {
  orderItem_id: serial('orderItem_id').primaryKey(),
  order_id: integer('order_id').references(() => order.order_id),
  quantity: integer('quantity').default(1),
  price: decimal('price', { precision: 50, scale: 2 }),
  status: varchar('status'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
