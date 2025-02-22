import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { supplier } from '../product/supplier.schema';

export const orderStatus = pgEnum('order_status', [
  'Waiting for Arrival',
  'Pending',
  'Delivered',
  'Returned',
  'Pending Payment',
  'Cancelled',
]);

export const order = pgTable('order', {
  order_id: serial('order_id').primaryKey(),
  supplier_id: integer('supplier_id').references(() => supplier.supplier_id),
  ordered_value: integer('ordered_value'),
  expected_arrival: varchar('expected_arrival'),
  message: varchar('message'),
  status: orderStatus('status'),
  order_total: integer('order_total'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
