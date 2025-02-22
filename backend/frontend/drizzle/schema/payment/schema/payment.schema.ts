import {
  integer,
  pgEnum,
  pgTable,
  real,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { borrow, jobOrder } from '../../services';
import { sales } from '../../sales';
import { discount } from '../../ims';

export const paymentStatusEnum = pgEnum('payment_status', [
  'Pending',
  'Completed',
  'Failed',
  'Cancelled',
  'Refunded',
  'Partially Refunded',
  'Overdue',
  'Processing',
  'Declined',
  'Authorized',
]);
export const paymentMethodEnum = pgEnum('payment_method', [
  'Cash',
  'Card',
  'Online Payment',
]);
export const serviceType = pgEnum('service_type', [
  'Borrow',
  'Reservation',
  'Sales',
  'Joborder',
]);

export const payment = pgTable('payment', {
  payment_id: serial('payment_id').primaryKey(),
  job_order_id: integer('job_order_id').references(() => jobOrder.job_order_id),
  borrow_id: integer('borrow_id').references(() => borrow.borrow_id),
  sales_id: integer('sales_id').references(() => sales.sales_id),
  service_type: serviceType('service_type').notNull(),
  amount: real('total_price'),
  vat_rate: real('vat_rate'),
  discount_id: integer('discount_id').references(() => discount.discount_id),
  payment_date: varchar('payment_date'),
  payment_method: paymentMethodEnum('payment_method').notNull(),
  payment_status: paymentStatusEnum('payment_status').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
