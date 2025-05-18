import {
  integer,
  pgEnum,
  pgTable,
  real,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const paymentMethodEnum = pgEnum('payment_method', [
  'Cash',
  'Card',
  'Online Payment',
]);
export const paymentType = pgEnum('payment_type', ['Service', 'Sales']);

export const payment = pgTable('payment', {
  payment_id: serial('payment_id').primaryKey(),
  amount: real('total_price'),
  paid_amount: real('paid_amount'),
  change_amount: real('change_amount'),
  vat_amount: real('vat_amount'),
  discount_amount: integer('discount_amount'),
  payment_date: varchar('payment_date'),
  payment_method: paymentMethodEnum('payment_method').notNull(),
  payment_type: paymentType('payment_type').notNull(),
  reference_number: varchar('reference_number'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
