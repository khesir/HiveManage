import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { reserve } from './reserve.schema';
import { product } from '@/drizzle/schema/ims';

export const reserveItemStatusEnum = pgEnum('reserveStatusEnum', [
  'Reserved',
  'Confirmed',
  'Cancelled',
  'Pending',
  'Completed',
]);

export const reserveItems = pgTable('reserve_items', {
  reserve_item_id: serial('reserve_item_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  reserve_id: integer('reserve_id').references(() => reserve.reserve_id),
  expiration_date: timestamp('expiration_date').defaultNow(),

  status: reserveItemStatusEnum('reserve_item_status').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
