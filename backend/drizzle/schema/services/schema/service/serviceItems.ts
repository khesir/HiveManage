import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { service } from './service.schema';
import { sql } from 'drizzle-orm';

export const serviceItemsStatus = pgEnum('service_item_status', [
  'Pending',
  'Used',
  'Sold',
  'Returned',
]);

export const serviceItem = pgTable('service_item', {
  service_item_id: serial('service_item_id').primaryKey(),
  service_id: integer('service_id').references(() => service.service_id),
  product_id: integer('product_id').references(() => service.service_id),
  serialize_items: integer('serialize_items')
    .array()
    .default(sql`'{}'::integer[]`),
  sold_price: integer('sold_price'),
  quantity: integer('quantity'),
  status: serviceItemsStatus('status'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
