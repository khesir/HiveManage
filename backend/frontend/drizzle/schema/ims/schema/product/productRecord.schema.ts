import {
  decimal,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { product } from './product.schema';
import { supplier } from './supplier.schema';

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

  total_quantity: integer('total_quantity').default(0).notNull(),
  available_quantity: integer('available_quantity').default(0),
  sold_quantity: integer('sold_quantity').default(0),
  transfered_quantity: integer('transfered_quantity').default(0),

  cost_price: decimal('cost_price', { precision: 50, scale: 2 }),
  selling_price: decimal('selling_price', { precision: 50, scale: 2 }),

  status: recordStatus('status').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
