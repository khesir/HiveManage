import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { employee } from '../../ems';
import { sales, salesItems } from '../../sales';
import { payment } from '../../payment';

export const salesLog = pgTable('salesLog', {
  sales_logs_id: serial('sales_logs_id').primaryKey(),
  sales_id: integer('sales_id').references(() => sales.sales_id),
  payment_id: integer('payment_id').references(() => payment.payment_id),
  sales_items_id: integer('sales_items_idv').references(
    () => salesItems.sales_items_id,
  ),
  action: varchar('action', { length: 255 }),
  quantity: integer('quantity'),
  performed_by: integer('performed_by').references(() => employee.employee_id),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
