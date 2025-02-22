import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { discount } from './discount.schema';
import { customer } from '@/drizzle/schema/customer';

export const couponredemptions = pgTable('couponredemptions', {
  couponredemptions_id: serial('couponredemptions_id').primaryKey(),
  customer_id: integer('customer_id').references(() => customer.customer_id),
  discount_id: integer('discount_id').references(() => discount.discount_id),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
