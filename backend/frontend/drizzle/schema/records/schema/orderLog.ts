import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { order, orderProduct } from '../../ims';
import { employee } from '../../ems';

export const OrderLog = pgTable('OrderTransLog', {
  order_log_id: serial('order_log_id').primaryKey(),
  order_id: integer('order_id').references(() => order.order_id),
  order_item_id: integer('order_item_id').references(
    () => orderProduct.order_product_id,
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
