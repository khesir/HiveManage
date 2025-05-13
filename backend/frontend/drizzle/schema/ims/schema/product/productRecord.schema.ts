import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { product } from './product.schema';
import { supplier } from './supplier.schema';
import { employee } from '@/drizzle/schema/ems';
import { orderProduct } from '../order/orderItem.schema';

export const productRecordStatus = pgEnum('product_record_status', [
  'Pending',
  'Confirmed',
  'Returned',
  'Sold',
  'Added',
]);

export const productRecordActionType = pgEnum('product_record_action_type', [
  'Received',
  'Returned',
  'Transferred',
]);
export const transferSource = pgEnum('transfer_source', [
  'Purchase Order',
  'Inventory',
  'Service',
  'Sales',
]);
export const productRecord = pgTable('product_record', {
  product_record_id: serial('product_record_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  supplier_id: integer('supplier_id').references(() => supplier.supplier_id),
  order_item_id: integer('order_item_id').references(
    () => orderProduct.order_product_id,
  ),
  quantity: integer('quantity').default(0),

  status: productRecordStatus('status').notNull(),
  action_type: productRecordActionType('action_type').notNull(),
  handled_by: integer('employee_id').references(() => employee.employee_id),
  source: transferSource('source'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
