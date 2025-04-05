import { product, productRecord, serializeProduct } from '@/drizzle/schema/ims';
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { service } from '../..';

export const serviceItems = pgTable('serviceItems', {
  service_items_id: serial('service_items_id').primaryKey(),
  product_id: integer('product_id').references(() => product.product_id),
  service_id: integer('service_id').references(() => service.service_id),
  product_record_id: integer('product_record_id').references(
    () => productRecord.product_record_id,
  ),
  serial_id: integer('serial_id').references(() => serializeProduct.serial_id),
  serviceitem_status: varchar('ticket_status').notNull(),
  quantity: integer('quantity'),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
