import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { product } from './product.schema';

export const serial_prod = pgEnum('serialprod_Status', [
  'Available',
  'Sold',
  'Decommissioned',
  'Reserved',
  'Pending',
  'Returned',
]);

export const serializeProducts = pgTable('serialized_products', {
  serialized_item_id: serial('batch_item_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  serial_number: varchar('serial_number').notNull(),
  status: serial_prod('status').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
