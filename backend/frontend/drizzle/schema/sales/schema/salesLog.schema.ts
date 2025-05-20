import {
  serial,
  integer,
  timestamp,
  pgEnum,
  varchar,
  decimal,
  pgTable,
} from 'drizzle-orm/pg-core';
import { employee } from '@/drizzle/schema/ems';
import { sales } from './sales.schema'; // your main sales table
import { salesItems } from './salesItems.schema';
import { product } from '../../ims';

// Enums
export const salesLogActionType = pgEnum('sales_log_action_type', [
  'Sold',
  'Returned',
  'Restocked',
  'Refunded',
  'Exchanged',
]);

export const salesLogStatus = pgEnum('sales_log_status', [
  'Completed',
  'Pending',
  'Refunded',
  'Partial Return',
  'Resolved',
]);

export const resolveTypeEnum = pgEnum('sales_resolve_type_enum', [
  'Refunded',
  'Replaced',
  'Discounted',
  'Cancelled',
]);

// Table
export const salesLog = pgTable('sales_log', {
  sales_log_id: serial('sales_log_id').primaryKey(),

  sales_id: integer('sales_id').references(() => sales.sales_id),
  sale_item_id: integer('sale_item_id').references(
    () => salesItems.sales_items_id,
  ),
  product_id: integer('product_id').references(() => product.product_id),

  total_quantity: integer('total_quantity').notNull(),
  returned_quantity: integer('returned_quantity').default(0),
  restocked_quantity: integer('restocked_quantity').default(0),
  refunded_amount: decimal('refunded_amount', {
    precision: 10,
    scale: 2,
  }).default('0.00'),

  status: salesLogStatus('status'),
  action_type: salesLogActionType('action_type'),
  resolve_type: resolveTypeEnum('resolve_type'),

  notes: varchar('notes', { length: 255 }),
  performed_by: integer('performed_by').references(() => employee.employee_id),

  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
