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

export const recordCondition = pgEnum('record_condition', [
  'New',
  'Secondhand',
  'Broken',
]);

export const recordStatus = pgEnum('product_status', [
  'Sold',
  'Pending Payment',
  'On Order',
  'In Service',
  'Awaiting Service',
  'Return Requested',
]);

export const serializeProducts = pgTable('serialized_products', {
  serial_id: serial('serial_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  serial_number: varchar('serial_number').notNull(),
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
