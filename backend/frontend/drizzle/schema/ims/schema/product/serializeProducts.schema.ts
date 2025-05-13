import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { product } from './product.schema';
import { supplier } from './supplier.schema';

export const serialCondition = pgEnum('serial_condition', [
  'New',
  'Secondhand',
  'Broken',
]);

export const serialStatus = pgEnum('serial_status', [
  'Sold',
  'Available',
  'In Service',
  'On Order',
  'Returned',
  'Damage',
  'Retired',
]);

export const serializeProduct = pgTable('serialized_product', {
  serial_id: serial('serial_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  supplier_id: integer('supplier_id').references(() => supplier.supplier_id),
  serial_code: varchar('serial_code', { length: 255 }),
  warranty_date: varchar('warranty_date'),
  condition: serialCondition('type').notNull(),
  status: serialStatus('status').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
