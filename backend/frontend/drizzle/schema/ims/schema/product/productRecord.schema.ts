import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { product } from './product.schema';

export const recordType = pgEnum('record_type', [
  'Firsthand',
  'Secondhand',
  'Broken',
]);

export const productRecord = pgTable('product_record', {
  product_record_id: serial('product_record_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  qty: integer('qty').default(0),
  created_at: timestamp('created_at').defaultNow(),
  record_type: recordType('record_type').notNull(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
