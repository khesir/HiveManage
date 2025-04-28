import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { customer } from '@/drizzle/schema/customer/schema/customer.schema';
import { service_Type } from './serviceType.schema';

export const service_status = pgEnum('service_status', [
  'Cancelled',
  'In Progress',
  'Pending',
  'Complete',
]);

export const service = pgTable('service', {
  service_id: serial('service_id').primaryKey(),
  service_type_id: integer('service_type_id').references(
    () => service_Type.service_type_id,
  ),
  uuid: varchar('uuid').notNull(),
  fee: integer('fee'),
  customer_id: integer('customer_id').references(() => customer.customer_id),
  service_status: service_status('service_status').notNull(),
  total_cost_price: integer('total_cost_price'),
  payment_status: integer('payment_status'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
