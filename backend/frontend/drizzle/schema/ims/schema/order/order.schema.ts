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
export const paymentStatus = pgEnum('payment_status', [
  'Unpaid',
  'Partially Paid',
  'Paid',
]);
export const paymentMethod = pgEnum('payment_method', [
  'Cash',
  'Credit Card',
  'Bank Transfer',
  'Check',
  'Digital Wallet',
]);

export const order = pgTable('order', {
  order_id: serial('order_id').primaryKey(),
  supplier_id: integer('supplier_id').references(() => supplier.supplier_id),
  expected_arrival: varchar('expected_arrival'),
  order_status: orderStatus('order_status'),
  payment_status: paymentStatus('payment_status'),
  payment_method: paymentMethod('payment_method'),
  notes: varchar('notes'),
  receive_at: timestamp('receive_at'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
