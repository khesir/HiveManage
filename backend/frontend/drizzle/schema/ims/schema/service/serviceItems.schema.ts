import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { product } from '../product/product.schema';
import { service_Type } from '@/drizzle/schema/services';

export const serviceItemStatus = pgEnum('service_item_status', [
  'Available',
  'Sold out',
]);

export const serviceItem = pgTable('service_item', {
  service_item_id: serial('service_item_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  service_type_id: integer('service_type_id').references(
    () => service_Type.service_type_id,
  ),

  quantity: integer('qty').default(0),
  status: serviceItemStatus('status').notNull(),

  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
