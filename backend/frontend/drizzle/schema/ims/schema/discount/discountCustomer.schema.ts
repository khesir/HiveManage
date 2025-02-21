import { customer } from '@/drizzle/schema/customer';
import { customerGroup } from '@/drizzle/schema/customer/schema/customerGroup.schema';
import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { discount } from './discount.schema';

export const discountCustomer = pgTable('discount_c', {
  discount_customer_id: serial('discount_c_id').primaryKey(),
  customer_id: integer('customer_id').references(() => customer.customer_id),
  customer_group_id: integer('customer_group').references(
    () => customerGroup.customer_group_id,
  ),
  discount_id: integer('discount_id').references(() => discount.discount_id),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
