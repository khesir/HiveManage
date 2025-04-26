import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { product } from '../..';

export const sourceType = pgEnum('source_Type', [
  'Supplier',
  'Stock',
  'Service',
  'Damage',
]);

export const destinationType = pgEnum('destination_Type', [
  'Stock',
  'Service',
  'Damage',
]);

export const inventoryMovement = pgTable('inventory_movement', {
  inventory_movement_id: serial('inventory_movement_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  source_type: sourceType('status').notNull(),
  destination_type: destinationType('status').notNull(),
  quantity: integer('quantity').default(0),
  serial_ids: varchar('serial_ids'),
  reason: varchar('reason'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
