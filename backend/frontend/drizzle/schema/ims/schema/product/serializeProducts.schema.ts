import {
  integer,
  pgEnum,
  pgTable,
  real,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { product } from './product.schema';

export const serialCondition = pgEnum('serial_condition', [
  'New',
  'Secondhand',
  'Broken',
]);

export const serialStatus = pgEnum('serial_status', [
  'Sold',
  'Pending Payment',
  'On Order',
  'In Service',
  'Awaiting Service',
  'Return Requested',
]);

export const serializeProduct = pgTable('serialized_product', {
  serial_id: serial('serial_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  serial_number: varchar('serial_number').notNull(),
  price: real('price').default(0),
  condition: serialCondition('type').notNull(),
  status: serialStatus('status').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
