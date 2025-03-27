import {
  decimal,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { supplier } from '../product/supplier.schema';

export const orderStatus = pgEnum('order_status', [
  'Draft',
  'Finalized',
  'Awaiting Arrival',
  'Partially Fulfiled',
  'Fulfilled',
  'Cancelled',
]);
export const paymentStatus = pgEnum('order_payment_status', [
  'Pending',
  'Partially Paid',
  'Paid',
]);
export const paymentMethod = pgEnum('order_payment_method', [
  'Cash',
  'Credit Card',
  'Bank Transfer',
  'Check',
  'Digital Wallet',
]);

export const order = pgTable('order', {
  order_id: serial('order_id').primaryKey(),
  supplier_id: integer('supplier_id').references(() => supplier.supplier_id),

  notes: varchar('notes'),
  receive_at: timestamp('receive_at'),
  expected_arrival: timestamp('expected_arrival'),

  order_value: decimal('order_value', { precision: 10, scale: 2 }),
  order_status: orderStatus('order_status'),
  order_payment_status: paymentStatus('order_payment_status'),
  order_payment_method: paymentMethod('order_payment_method'),

  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
