import {
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
import { serviceItem } from './serviceItems.schema';
import { productRecord } from '../..';

export const recordStatus = pgEnum('record_status', ['Sold', 'Available']);

export const serviceRecord = pgTable('service_record', {
  service_record_id: serial('service_record_id').primaryKey(),
  product_record_id: integer('product_record_id').references(
    () => productRecord.product_record_id,
  ),
  service_item_id: integer('service_item_id').references(
    () => serviceItem.service_type_id,
  ),
  available_quantity: integer('available_quantity').default(0),
  on_service_quantiy: integer('on_service_quantiy').default(0),
  sold_quantity: integer('sold_quantity').default(0),

  status: recordStatus('status').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  last_updated: timestamp('last_updated')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  deleted_at: timestamp('deleted_at'),
});
