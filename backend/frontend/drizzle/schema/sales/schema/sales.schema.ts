import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { customer } from '../../customer';
import { employee } from '../../ems';

export const salesStatus = pgEnum('sales_status', [
  'Completed',
  'Partially Completed',
  'Cancelled',
  'Pending',
]);

export const sales = pgTable('sales', {
  sales_id: serial('sales_id').primaryKey(),
  customer_id: integer('customer_id').references(() => customer.customer_id),
  status: salesStatus('sales_status').notNull(),
  handled_by: integer('handled_by').references(() => employee.employee_id),
  product_sold: integer('product_sold'),
  total_price: integer('total_price'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
