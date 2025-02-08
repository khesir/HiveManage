import { customer } from '@/drizzle/schema/customer';
import { customer_group } from '@/drizzle/schema/customer/schema/customerGroup.schema';
import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';

export const discountCustomer = pgTable('discount_customer', {
  discount_customer_id: serial('discount_customer_id').primaryKey(),
  customer_id: integer('customer_id').references(() => customer.customer_id),
  customer_group_id: integer('customer_group').references(
    () => customer_group.customer_group_id,
  ),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
