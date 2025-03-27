import {
  integer,
  pgEnum,
  pgTable,
  real,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { product } from './product.schema';
import { supplier } from './supplier.schema';

export const recordCondition = pgEnum('record_condition', [
  'New',
  'Secondhand',
  'Broken',
]);

export const recordStatus = pgEnum('record_status', [
  'Sold',
  'Available',
  'In Service',
  'On Order',
  'Sold out',
]);

export const productRecord = pgTable('product_record', {
  product_record_id: serial('product_record_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  supplier_id: integer('supplier_id').references(() => supplier.supplier_id),
  quantity: integer('qty').default(0),
  price: real('price').default(0),
  condition: recordCondition('type').notNull(),
  status: recordStatus('status').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
